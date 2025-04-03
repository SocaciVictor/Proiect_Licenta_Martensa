package com.martensa.userService.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.martensa.userService.dto.request.OrderDTO;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;


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

    @Size(max = 20)
    @NotBlank
    @Column(unique = true, nullable = false, name = "username")
    private String username;

    @Setter
    @Size(max = 120)
    @NotBlank
    @Email
    @Column(unique = true, nullable = false, name = "email")
    private String email;

    @Size(max = 120)
    private String password;

    @OneToOne
    private LoyaltyCard loyaltyCard;

    private String address;
    private String phoneNumber;
    private LocalDate dateOfBirth;

    @Column(name="isOAuthAccount")
    private Boolean isOAuthAccount;

    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private LocalDateTime createdAt;

    @Transient
    private List<OrderDTO> ordersId;

    @ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    public User(String email, String username, String encode) {
        this.username = username;
        this.email = email;
        this.password = encode;
    }

}
