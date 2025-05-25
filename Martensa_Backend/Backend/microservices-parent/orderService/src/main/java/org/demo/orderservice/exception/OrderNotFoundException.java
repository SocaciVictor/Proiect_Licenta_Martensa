package org.demo.orderservice.exception;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(Long id) {
        super("Comanda cu ID-ul " + id + " nu a fost găsită.");
    }
}

