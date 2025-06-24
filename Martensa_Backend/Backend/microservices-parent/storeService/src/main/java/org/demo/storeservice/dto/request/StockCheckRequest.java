package org.demo.storeservice.dto.request;

import java.util.List;

public record StockCheckRequest(
        List<Long> productIds
) {}
