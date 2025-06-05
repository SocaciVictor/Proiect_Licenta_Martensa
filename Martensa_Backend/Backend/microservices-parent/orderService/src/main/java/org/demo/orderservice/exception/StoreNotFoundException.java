package org.demo.orderservice.exception;


public class StoreNotFoundException extends RuntimeException {
    public StoreNotFoundException(Long id) {
        super("Store with ID " + id + " not found.");
    }
    public StoreNotFoundException(String message) {super((message));}
}

