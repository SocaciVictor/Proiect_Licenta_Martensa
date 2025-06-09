package org.demo.paymentservice.repository;

import org.demo.paymentservice.model.ProcessedWebhook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProcessedWebhookRepository extends JpaRepository<ProcessedWebhook,Long> {
    boolean existsByEventId(String eventId);
}
