package org.demo.productservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "PRODUCT")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal discountPrice;

    private int stockQuantity;
    private String imageUrl;
    private String barcode;
    private String brand;
    private String ingredients;
    private String nutritionalInfo;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}
