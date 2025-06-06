package org.demo.storeservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.demo.storeservice.dto.request.StoreRequest;
import org.demo.storeservice.dto.response.StoreResponse;
import org.demo.storeservice.service.StoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @GetMapping
    public ResponseEntity<List<StoreResponse>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreResponse> getStoreById(@PathVariable Long id) {
        return ResponseEntity.ok(storeService.getStoreById(id));
    }

    @PostMapping
    public ResponseEntity<Void> createStore(@RequestBody @Valid StoreRequest request) {
        storeService.createStore(request);
        return ResponseEntity.status(201).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateStore(@PathVariable Long id, @RequestBody @Valid StoreRequest request) {
        storeService.updateStore(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available")
    public ResponseEntity<List<StoreResponse>> getStoresWithStock(@RequestBody List<Long> productIds) {
        return ResponseEntity.ok(storeService.findStoresWithProductsInStock(productIds));
    }

}
