package org.demo.paymentservice.service.impl;

import com.stripe.Stripe;
import com.stripe.param.checkout.SessionCreateParams;
import org.demo.paymentservice.dto.ProductRequest;
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
    //stripe -API
    //-> productName, amount, quantity, currency
    public StripeResponse checkoutProducts(StripeCheckoutRequest checkoutRequest) {
        Stripe.apiKey = secretKey;

        List<SessionCreateParams.LineItem> lineItems = checkoutRequest.products().stream().map(product ->
                SessionCreateParams.LineItem.builder()
                        .setQuantity(product.quantity())
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency(product.currency() != null ? product.currency() : "RON")
                                        .setUnitAmountDecimal(product.amount())
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName(product.name())
                                                        .build()
                                        )
                                        .build()
                        )
                        .build()
        ).toList();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("martensa://success?orderId=" + checkoutRequest.orderId())
                .setCancelUrl("martensa://cancel?orderId=" + checkoutRequest.orderId())
                .setClientReferenceId(checkoutRequest.orderId().toString()) // 👈 Aici pentru webhook
                .putMetadata("userId", checkoutRequest.userId().toString()) // 👈 UserId pentru webhook
                .addAllLineItem(lineItems)
                .build();


        try {
            Session session = Session.create(params);

            return new StripeResponse(
                    "SUCCESS",
                    "Session created successfully",
                    session.getId(),
                    session.getUrl()
            );

        } catch (StripeException e) {
            e.printStackTrace();

            return new StripeResponse(
                    "FAILED",
                    "Error creating Stripe session: " + e.getMessage(),
                    null,
                    null
            );
        }
    }

}

