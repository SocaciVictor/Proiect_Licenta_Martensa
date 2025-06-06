package org.demo.paymentservice.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.demo.paymentservice.config.PaymentRabbitProperties;
import org.demo.paymentservice.dto.PaymentCompletedEvent;
import org.demo.paymentservice.dto.ProductQuantity;
import org.demo.paymentservice.model.enums.PaymentStatus;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/payments/stripe/webhook")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    private final RabbitTemplate rabbitTemplate;
    private final PaymentRabbitProperties rabbitProps;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @PostMapping
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
                                                      @RequestHeader("Stripe-Signature") String sigHeader) {
        log.info("⬅️ [x] Received Stripe Webhook! Payload = {}", payload);

        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            log.error("❌ Webhook signature verification failed.", e);
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            log.info("✅ Processing checkout.session.completed");

            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElseThrow(() -> new IllegalStateException("Invalid session object"));

            try {
                Long orderId = Long.parseLong(session.getClientReferenceId());
                Long userId = Long.parseLong(session.getMetadata().get("userId"));

                BigDecimal amount = session.getAmountTotal() != null
                        ? new BigDecimal(session.getAmountTotal()).divide(new BigDecimal(100))
                        : BigDecimal.ZERO;

                String productsJson = session.getMetadata().get("products");
                List<ProductQuantity> products = objectMapper.readValue(productsJson, new TypeReference<>() {});

                // Emit PaymentCompletedEvent
                rabbitTemplate.convertAndSend(
                        rabbitProps.getOrderResponse().getExchange(),
                        rabbitProps.getOrderResponse().getRoutingKey(),
                        new PaymentCompletedEvent(
                                orderId,
                                userId,
                                amount,
                                PaymentStatus.SUCCESS,
                                products
                        )
                );

                log.info("✅ Emitted PaymentCompletedEvent for orderId={} userId={} amount={} products={}",
                        orderId, userId, amount, products);

            } catch (Exception e) {
                log.error("💥 Error processing checkout.session.completed webhook", e);
            }
        } else {
            log.info("ℹ️ Ignored event type: {}", event.getType());
        }

        return ResponseEntity.ok("Webhook processed");
    }

}
