package com.martensa.userService.listener;

import com.martensa.userService.dto.LoyaltyPointsEvent;
import com.martensa.userService.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class LoyaltyPointsListener {

    private final UserRepository userRepository;

    @RabbitListener(queues = "${rabbit.loyalty-points.queue}")
    public void handleLoyaltyPointsEvent(LoyaltyPointsEvent event) {
        log.info("⬅️ [x] Received LoyaltyPointsEvent: userId={}, amountPaid={}", event.userId(), event.amountPaid());

        userRepository.findById(event.userId()).ifPresent(user -> {
            int pointsToAdd = event.amountPaid().intValue();

            user.getLoyaltyCard().setPoints(user.getLoyaltyCard().getPoints() + pointsToAdd);

            userRepository.save(user);

            log.info("🏅 Added {} loyalty points to user {}", pointsToAdd, user.getEmail());
        });
    }
}
