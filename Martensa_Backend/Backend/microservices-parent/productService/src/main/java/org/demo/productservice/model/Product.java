package org.demo.productservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "PRODUCT")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String brand;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal discountPrice;

    private String imageUrl;
    private String barcode;
    private String ingredients;
    private String nutritionalInfo;
    private String disclaimer;
    private Double alcoholPercentage;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}

