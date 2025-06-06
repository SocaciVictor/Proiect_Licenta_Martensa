package org.demo.paymentservice.controller;

import lombok.RequiredArgsConstructor;
import org.demo.paymentservice.dto.StripeCheckoutRequest;
import org.demo.paymentservice.dto.StripeResponse;
import org.demo.paymentservice.service.impl.StripeServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments/stripe")
public class StripePaymentController {

    private final StripeServiceImpl stripeService;

    public StripePaymentController(StripeServiceImpl stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<StripeResponse> checkout(@RequestBody StripeCheckoutRequest checkoutRequest) {
        StripeResponse response = stripeService.checkoutProducts(checkoutRequest);
        return ResponseEntity.ok(response);
    }
}

