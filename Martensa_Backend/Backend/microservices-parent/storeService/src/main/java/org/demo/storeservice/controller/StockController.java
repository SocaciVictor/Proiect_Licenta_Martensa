package org.demo.storeservice.controller;

import lombok.RequiredArgsConstructor;
import org.demo.storeservice.dto.StoreProductStockDto;
import org.demo.storeservice.dto.request.CreateOrUpdateStockRequest;
import org.demo.storeservice.service.StoreProductStockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stores/{storeId}/stock")
@RequiredArgsConstructor
@CrossOrigin
public class StockController {

    private final StoreProductStockService stockService;

    @PostMapping
    public ResponseEntity<StoreProductStockDto> upsert(@PathVariable Long storeId, @RequestBody CreateOrUpdateStockRequest request) {
        return ResponseEntity.ok(stockService.upsertStock(storeId, request));
    }

    @GetMapping("/{productId}")
    public ResponseEntity<StoreProductStockDto> getStock(@PathVariable Long storeId, @PathVariable Long productId) {
        return ResponseEntity.ok(stockService.getStock(storeId, productId));
    }

    @GetMapping
    public ResponseEntity<List<StoreProductStockDto>> getAll(@PathVariable Long storeId) {
        return ResponseEntity.ok(stockService.getAllStockForStore(storeId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> delete(@PathVariable Long storeId, @PathVariable Long productId) {
        stockService.deleteStock(storeId, productId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{productId}/decrease")
    public ResponseEntity<Void> decreaseStock(
            @PathVariable Long storeId,
            @PathVariable Long productId,
            @RequestParam int quantity) {
        stockService.decreaseStock(storeId, productId, quantity);
        return ResponseEntity.ok().build();
    }

}
