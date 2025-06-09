package org.demo.paymentservice.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.demo.paymentservice.config.PaymentRabbitProperties;
import org.demo.paymentservice.config.StripeProperties;
import org.demo.paymentservice.dto.PaymentCompletedEvent;
import org.demo.paymentservice.dto.ProductQuantity;
import org.demo.paymentservice.model.ProcessedWebhook;
import org.demo.paymentservice.model.enums.PaymentStatus;
import org.demo.paymentservice.repository.ProcessedWebhookRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments/stripe/webhook")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    private final RabbitTemplate rabbitTemplate;
    private final PaymentRabbitProperties rabbitProps;
    private final StripeProperties stripeProperties;
    private final ProcessedWebhookRepository processedWebhookRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload,
                                                      @RequestHeader("Stripe-Signature") String sigHeader) {
        log.info("⬅️ [x] Received Stripe Webhook! Payload = {}", payload);

        Event event = null;
        boolean verified = false;

        // Verificare semnătură cu toate secretele din config
        for (String secret : stripeProperties.getWebhookSecrets()) {
            try {
                event = Webhook.constructEvent(payload, sigHeader, secret);
                verified = true;
                break;
            } catch (SignatureVerificationException e) {
                // Ignor, încerc cu următorul secret
            }
        }

        if (!verified) {
            log.error("❌ Webhook signature verification failed.");
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        log.info("✅ Webhook verified. Event type: {}", event.getType());

        String eventId = event.getId();

        if (processedWebhookRepository.existsByEventId(eventId)) {
            log.warn("⚠️ Webhook event {} already processed. Skipping.", eventId);
            return ResponseEntity.ok("Event already processed");
        }

        processedWebhookRepository.save(new ProcessedWebhook(eventId));

        if ("checkout.session.completed".equals(event.getType())) {
            log.info("✅ Processing checkout.session.completed");

            Session session = (Session) event.getDataObjectDeserializer()
                    .getObject()
                    .orElseThrow(() -> new IllegalStateException("Invalid session object"));

            try {
                Stripe.apiKey = stripeProperties.getSecretKey();

                String paymentIntentId = session.getPaymentIntent();
                PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
                Map<String, String> metadata = intent.getMetadata();

                log.info("🎁 PaymentIntent metadata = {}", metadata);

                Long orderId = Long.parseLong(metadata.get("orderId"));
                Long userId = Long.parseLong(metadata.get("userId"));

                BigDecimal amount = session.getAmountTotal() != null
                        ? new BigDecimal(session.getAmountTotal()).divide(new BigDecimal(100))
                        : BigDecimal.ZERO;

                String productsJson = metadata.get("products");
                List<ProductQuantity> products = objectMapper.readValue(productsJson, new TypeReference<>() {});

                rabbitTemplate.convertAndSend(
                        rabbitProps.getOrderResponse().getExchange(),
                        rabbitProps.getOrderResponse().getRoutingKey(),
                        new PaymentCompletedEvent(
                                orderId,
                                userId,
                                amount,
                                products,
                                PaymentStatus.SUCCESS
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
