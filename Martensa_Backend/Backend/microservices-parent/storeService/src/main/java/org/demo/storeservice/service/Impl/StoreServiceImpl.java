package org.demo.storeservice.service.Impl;

import lombok.RequiredArgsConstructor;
import org.demo.storeservice.dto.request.StoreRequest;
import org.demo.storeservice.dto.response.StoreResponse;
import org.demo.storeservice.exception.StoreNotFoundException;
import org.demo.storeservice.mapper.StoreMapper;
import org.demo.storeservice.model.Store;
import org.demo.storeservice.repository.StoreRepository;
import org.demo.storeservice.service.StoreService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final StoreMapper storeMapper;

    @Override
    public List<StoreResponse> getAllStores() {
        return storeMapper.toResponseList(storeRepository.findAll());
    }

    @Override
    public StoreResponse getStoreById(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new StoreNotFoundException(id));
        return storeMapper.toResponse(store);
    }

    @Override
    public void createStore(StoreRequest request) {
        Store store = storeMapper.toEntity(request);
        storeRepository.save(store);
    }

    @Override
    public void updateStore(Long id, StoreRequest request) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new StoreNotFoundException(id));

        storeMapper.updateStoreFromRequest(request, store);
        storeRepository.save(store);
    }


    @Override
    public void deleteStore(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new StoreNotFoundException(id));
        storeRepository.delete(store);
    }
}
