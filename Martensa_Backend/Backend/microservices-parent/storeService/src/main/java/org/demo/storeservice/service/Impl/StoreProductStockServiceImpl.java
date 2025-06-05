package org.demo.storeservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.demo.storeservice.dto.StoreProductStockDto;
import org.demo.storeservice.dto.request.CreateOrUpdateStockRequest;
import org.demo.storeservice.exception.StockNotFoundException;
import org.demo.storeservice.exception.StoreNotFoundException;
import org.demo.storeservice.mapper.StoreProductStockMapper;
import org.demo.storeservice.model.Store;
import org.demo.storeservice.model.StoreProductStock;
import org.demo.storeservice.repository.StoreProductStockRepository;
import org.demo.storeservice.repository.StoreRepository;
import org.demo.storeservice.service.StoreProductStockService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreProductStockServiceImpl implements StoreProductStockService {

    private final StoreProductStockRepository stockRepository;
    private final StoreRepository storeRepository;
    private final StoreProductStockMapper mapper;

    @Override
    public StoreProductStockDto upsertStock(Long storeId, CreateOrUpdateStockRequest request) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new StockNotFoundException("Store not found"));

        StoreProductStock stock = stockRepository.findByStoreIdAndProductId(storeId, request.productId())
                .orElse(StoreProductStock.builder()
                        .store(store)
                        .productId(request.productId())
                        .build());

        stock.setQuantity(request.quantity());
        return mapper.toDto(stockRepository.save(stock));
    }

    @Override
    public StoreProductStockDto getStock(Long storeId, Long productId) {
        return stockRepository.findByStoreIdAndProductId(storeId, productId)
                .map(mapper::toDto)
                .orElseThrow(() -> new StockNotFoundException("Stocul nu a fost găsit."));
    }

    @Override
    public List<StoreProductStockDto> getAllStockForStore(Long storeId) {
        storeRepository.findById(storeId)
                .orElseThrow(() -> new StoreNotFoundException(storeId));

        return mapper.toDtoList(stockRepository.findAllByStoreId(storeId));
    }

    @Override
    public void deleteStock(Long storeId, Long productId) {
        StoreProductStock stock = stockRepository.findByStoreIdAndProductId(storeId, productId)
                .orElseThrow(() -> new StockNotFoundException("Stocul nu a fost găsit."));
        stockRepository.delete(stock);
    }

    @Override
    public void decreaseStock(Long storeId, Long productId, int quantity) {
        storeRepository.findById(storeId)
                .orElseThrow(() -> new StoreNotFoundException(storeId));

        StoreProductStock stock = stockRepository.findByStoreIdAndProductId(storeId, productId)
                .orElseThrow(() -> new StockNotFoundException("Stoc inexistent pentru produsul " + productId));

        if (stock.getQuantity() < quantity) {
            throw new StockNotFoundException("Stoc insuficient pentru produsul " + productId);
        }

        stock.setQuantity(stock.getQuantity() - quantity);
        stockRepository.save(stock);
    }

}
