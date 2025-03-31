package org.demo.orderservice.service.Impl;

import org.demo.orderservice.repository.OrderHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderHistoryServiceImpl {

    private final OrderHistoryRepository repository;

    @Autowired
    public OrderHistoryServiceImpl(OrderHistoryRepository repository) {
        this.repository = repository;
    }
}
