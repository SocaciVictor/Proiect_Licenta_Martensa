package org.demo.paymentservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@Table(name = "processed_webhook")
public class ProcessedWebhook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", unique = true, nullable = false)
    private String eventId;

    @Column(name = "processed_at", nullable = false)
    private LocalDateTime processedAt = LocalDateTime.now();

    public ProcessedWebhook() {}

    public ProcessedWebhook(String eventId) {
        this.eventId = eventId;
    }

}
