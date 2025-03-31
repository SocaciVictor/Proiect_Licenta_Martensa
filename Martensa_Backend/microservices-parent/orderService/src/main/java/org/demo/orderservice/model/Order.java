package org.demo.orderservice.model;

import jakarta.persistence.*;
import lombok.*;
import org.demo.orderservice.dto.ProductDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "ORDERS")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    private LocalDate orderDate;
    private BigDecimal totalAmount;
    private String orderStatus;
    private String shippingAddress;
    private String paymentMethod;
    private String trackingNumber;

    @Transient // Nu persista in baza de date
    private List<ProductDTO> products;
}
