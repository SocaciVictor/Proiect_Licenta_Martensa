package org.demo.storeservice.service;

import org.demo.storeservice.dto.StoreProductStockDto;
import org.demo.storeservice.dto.request.CreateOrUpdateStockRequest;
import org.demo.storeservice.dto.response.MissingStockDto;

import java.util.List;

public interface StoreProductStockService {
    StoreProductStockDto upsertStock(Long storeId, CreateOrUpdateStockRequest request);
    StoreProductStockDto getStock(Long storeId, Long productId);
    List<StoreProductStockDto> getAllStockForStore(Long storeId);
    void deleteStock(Long storeId, Long productId);
    List<MissingStockDto> checkProductsInStock(Long storeId, List<Long> productIds);
    void decreaseStock(Long storeId, Long productId, int quantity);
}
