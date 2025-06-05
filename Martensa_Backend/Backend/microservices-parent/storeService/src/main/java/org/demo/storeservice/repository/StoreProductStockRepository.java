package org.demo.storeservice.repository;

import org.demo.storeservice.model.StoreProductStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreProductStockRepository extends JpaRepository<StoreProductStock, Long> {
    Optional<StoreProductStock> findByStoreIdAndProductId(Long storeId, Long productId);
    List<StoreProductStock> findAllByStoreId(Long storeId);
}
