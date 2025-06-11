package org.demo.paymentservice.mapper;

import org.demo.paymentservice.dto.PaymentResponse;
import org.demo.paymentservice.dto.UserSummaryResponse;
import org.demo.paymentservice.model.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    @Mapping(target = "id", source = "payment.id")
    @Mapping(target = "orderId", source = "payment.orderId")
    @Mapping(target = "userSummaryResponse", expression = "java(toUserSummaryResponse(userProfileResponse))")
    @Mapping(target = "amount", source = "payment.amount")
    @Mapping(target = "status", source = "payment.status")
    @Mapping(target = "method", source = "payment.method")
    @Mapping(target = "paymentDate", source = "payment.paymentDate")
    PaymentResponse toPaymentResponse(Payment payment, UserSummaryResponse userProfileResponse);

    // default method → mapezi UserProfileResponse în UserSummaryResponse
    default UserSummaryResponse toUserSummaryResponse(UserSummaryResponse userProfileResponse) {
        if (userProfileResponse == null) {
            return null;
        }
        return new UserSummaryResponse(
                userProfileResponse.id(),
                userProfileResponse.firstName(),
                userProfileResponse.lastName(),
                userProfileResponse.email()
        );
    }

    List<PaymentResponse> toPaymentResponseList(List<Payment> payments);
}
