package org.demo.productservice.repository;

import org.demo.productservice.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findAllByCategoryId(Long id);
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.promotions")
    List<Product> findAllWithPromotions();

}
