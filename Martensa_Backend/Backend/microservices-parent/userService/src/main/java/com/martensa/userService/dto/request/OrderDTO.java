package com.martensa.userService.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public class OrderDTO {
    private Long id;
    private LocalDate orderDate;
    private BigDecimal totalAmount;
    private String orderStatus;
    private String shippingAddress;
    private String paymentMethod;
    private String trackingNumber;

}
