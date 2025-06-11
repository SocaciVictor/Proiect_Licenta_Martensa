package org.demo.paymentservice.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.demo.paymentservice.dto.PaymentResponse;
import org.demo.paymentservice.dto.UserSummaryResponse;
import org.demo.paymentservice.feign.UserClient;
import org.demo.paymentservice.mapper.PaymentMapper;
import org.demo.paymentservice.model.Payment;
import org.demo.paymentservice.repository.PaymentRepository;
import org.demo.paymentservice.service.PaymentService;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserClient userClient;
    private final PaymentMapper paymentMapper;

    @Override
    public Payment save(Payment payment) {
        log.info("💰 Saving payment: orderId={}, amount={}, userId={}",
                payment.getOrderId(),
                payment.getAmount(),
                payment.getUserId());
        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getPaymentsByUserId(Long userId) {
        if (userId == null) {
            log.warn("⚠️ getPaymentsByUserId called with null userId");
            return Collections.emptyList();
        }
        return paymentRepository.findByUserId(userId);
    }

    @Override
    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream()
                .map(payment -> {
                    UserSummaryResponse user = null;
                    try {
                        user = userClient.getUserById(payment.getUserId()).getBody();
                    } catch (Exception e) {
                        System.out.println("Eroare la apel UserClient: " + e.getMessage());
                    }

                    return paymentMapper.toPaymentResponse(payment, user);
                })
                .toList();
    }
}
