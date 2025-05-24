package org.demo.storeservice.dto.request;

public record StoreRequest(
        String name,
        String location,
        String openingHours,
        String contactNumber,
        String managerName,
        String availableServices
) {
}
