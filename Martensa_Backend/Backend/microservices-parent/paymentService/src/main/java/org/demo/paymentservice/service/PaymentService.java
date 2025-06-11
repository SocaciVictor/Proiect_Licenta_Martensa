package org.demo.paymentservice.service;

import org.demo.paymentservice.dto.PaymentResponse;
import org.demo.paymentservice.model.Payment;

import java.util.List;

public interface PaymentService {
    Payment save(Payment payment);
    List<Payment> getPaymentsByUserId(Long userId);
    List<PaymentResponse> getAllPayments();
}
