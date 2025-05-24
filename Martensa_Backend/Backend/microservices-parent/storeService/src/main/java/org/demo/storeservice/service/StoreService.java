package org.demo.storeservice.service;

import org.demo.storeservice.dto.request.StoreRequest;
import org.demo.storeservice.dto.response.StoreResponse;

import java.util.List;

public interface StoreService {
    List<StoreResponse> getAllStores();
    StoreResponse getStoreById(Long id);
    void createStore(StoreRequest request);
    void updateStore(Long id, StoreRequest request);
    void deleteStore(Long id);
}
