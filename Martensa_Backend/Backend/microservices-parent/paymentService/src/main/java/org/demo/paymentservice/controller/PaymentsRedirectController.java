package org.demo.paymentservice.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments/stripe")
@Slf4j
public class PaymentsRedirectController {

    @GetMapping("/success")
    public ResponseEntity<String> success(@RequestParam("orderId") Long orderId) {
        log.info("✅ User landed on success page for orderId={}", orderId);

        // Redirect către martensa://success?orderId=...
        String redirectUrl = "martensa://success?orderId=" + orderId;

        String html = "<html><head><meta http-equiv='refresh' content='0;url=" + redirectUrl + "'/></head><body>Redirecting to app...</body></html>";

        return ResponseEntity.ok().body(html);
    }

    @GetMapping("/cancel")
    public ResponseEntity<String> cancel(@RequestParam("orderId") Long orderId) {
        log.info("❌ User landed on cancel page for orderId={}", orderId);

        String redirectUrl = "martensa://cancel?orderId=" + orderId;

        String html = "<html><head><meta http-equiv='refresh' content='0;url=" + redirectUrl + "'/></head><body>Redirecting to app...</body></html>";

        return ResponseEntity.ok().body(html);
    }
}

