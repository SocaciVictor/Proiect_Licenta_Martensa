package com.martensa.martensa.model;

import java.time.LocalDate;
import java.util.List;

import com.martensa.martensa.model.enums.UserRole;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "USER")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String loyaltyCardNumber;
    private String address;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String preferences;

    @Enumerated(EnumType.STRING)
    private UserRole role;

     @OneToMany(mappedBy = "user")
    private List<Order> orders;
}
