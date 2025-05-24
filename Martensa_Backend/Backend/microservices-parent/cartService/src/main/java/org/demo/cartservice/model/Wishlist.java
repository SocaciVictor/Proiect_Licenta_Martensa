package org.demo.cartservice.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "WISHLIST")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userID;

    @ElementCollection
    @CollectionTable(name = "wishlist_products", joinColumns = @JoinColumn(name = "wishlist_id"))
    @Column(name = "product_id")
    private List<Long> productsID = new ArrayList<>();

}
