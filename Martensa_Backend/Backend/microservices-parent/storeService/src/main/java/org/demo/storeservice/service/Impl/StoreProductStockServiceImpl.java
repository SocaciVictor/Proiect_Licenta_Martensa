package org.demo.storeservice.service.Impl;

import lombok.RequiredArgsConstructor;
import org.demo.storeservice.dto.StoreProductStockDto;
import org.demo.storeservice.dto.request.CreateOrUpdateStockRequest;
import org.demo.storeservice.dto.response.MissingStockDto;
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
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

        Optional<StoreProductStock> optionalStock = stockRepository.findByStoreIdAndProductId(storeId, request.productId());

        StoreProductStock stock;

        if (optionalStock.isPresent()) {
            stock = optionalStock.get();
            stock.setQuantity(stock.getQuantity() + request.quantity());
        } else {
            stock = StoreProductStock.builder()
                    .store(store)
                    .productId(request.productId())
                    .quantity(request.quantity())
                    .build();
        }

        StoreProductStock saved = stockRepository.save(stock);
        return mapper.toDto(saved);
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

    @Override
    public List<MissingStockDto> checkProductsInStock(Long storeId, List<Long> productIds) {
        List<StoreProductStock> stockList = stockRepository.findAllByStoreIdAndProductIdIn(storeId, productIds);

        Map<Long, Integer> stockMap = stockList.stream()
                .collect(Collectors.toMap(StoreProductStock::getProductId, StoreProductStock::getQuantity));

        return productIds.stream()
                .filter(pid -> !stockMap.containsKey(pid) || stockMap.get(pid) <= 0)
                .map(pid -> new MissingStockDto(pid, "Produsul cu ID-ul " + pid + " nu este în stoc la acest magazin."))
                .toList();
    }


}
