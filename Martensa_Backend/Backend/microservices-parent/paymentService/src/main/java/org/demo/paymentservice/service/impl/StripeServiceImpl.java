package org.demo.paymentservice.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.Stripe;
import com.stripe.param.checkout.SessionCreateParams;
import org.demo.paymentservice.dto.ProductQuantity;
import org.demo.paymentservice.dto.StripeCheckoutRequest;
import org.demo.paymentservice.dto.StripeResponse;
import org.springframework.beans.factory.annotation.Value;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StripeServiceImpl {

    @Value("${stripe.secretKey}")
    private String secretKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public StripeResponse checkoutProducts(StripeCheckoutRequest checkoutRequest) {
        Stripe.apiKey = secretKey;

        List<SessionCreateParams.LineItem> lineItems = checkoutRequest.products().stream()
                .map(product -> SessionCreateParams.LineItem.builder()
                        .setQuantity(product.quantity())
                        .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency(product.currency() != null ? product.currency() : "RON")
                                .setUnitAmountDecimal(product.amount()) // *100 din frontend
                                .setProductData(SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(product.name())
                                        .build())
                                .build())
                        .build())
                .toList();

        List<ProductQuantity> productQuantities = checkoutRequest.products().stream()
                .map(p -> new ProductQuantity(p.productId(), (int) p.quantity().longValue()))
                .toList();

        try {
            String productsJson = objectMapper.writeValueAsString(productQuantities);

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl("martensa://success?orderId=" + checkoutRequest.orderId())
                    .setCancelUrl("martensa://cancel?orderId=" + checkoutRequest.orderId())
                    .setClientReferenceId(checkoutRequest.orderId().toString())
                    .setPaymentIntentData(
                            SessionCreateParams.PaymentIntentData.builder()
                                    .putMetadata("orderId", checkoutRequest.orderId().toString())
                                    .putMetadata("userId", checkoutRequest.userId().toString())
                                    .putMetadata("products", productsJson)
                                    .build()
                    )
                    .addAllLineItem(lineItems)
                    .build();

            Session session = Session.create(params);

            return new StripeResponse(
                    "SUCCESS",
                    "Session created successfully",
                    session.getId(),
                    session.getUrl()
            );

        } catch (StripeException | RuntimeException e) {
            e.printStackTrace();

            return new StripeResponse(
                    "FAILED",
                    "Error creating Stripe session: " + e.getMessage(),
                    null,
                    null
            );
        } catch (Exception e) {
            e.printStackTrace();
            return new StripeResponse(
                    "FAILED",
                    "Error serializing ProductQuantities: " + e.getMessage(),
                    null,
                    null
            );
        }
    }

}

