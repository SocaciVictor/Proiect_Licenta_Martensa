package org.demo.storeservice.dto.response;

public record StoreResponse(
        Long id,
        String name,
        String location,
        String openingHours,
        String contactNumber,
        String managerName,
        String availableServices
) {
}
