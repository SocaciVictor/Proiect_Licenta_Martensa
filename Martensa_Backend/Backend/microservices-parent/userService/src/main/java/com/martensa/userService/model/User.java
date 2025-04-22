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
import jakarta.validation.constraints.Pattern;
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

    @NotBlank(message = "Prenumele nu poate fi gol.")
    @Size(min = 2, max = 50, message = "Prenumele trebuie să aibă între 2 și 50 de caractere.")
    @Pattern(regexp = "^[A-ZĂÂÎȘȚa-zăâîșț\\- ]+$", message = "Prenumele poate conține doar litere, cratime și spații.")
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @NotBlank(message = "Numele nu poate fi gol.")
    @Size(min = 2, max = 50, message = "Numele trebuie să aibă între 2 și 50 de caractere.")
    @Pattern(regexp = "^[A-ZĂÂÎȘȚa-zăâîșț\\- ]+$", message = "Numele poate conține doar litere, cratime și spații.")
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @Setter
    @Size(max = 120)
    @NotBlank
    @Email
    @Column(unique = true, nullable = false, name = "email")
    private String email;

    @Setter
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

    @Setter
    @ManyToMany(fetch = FetchType.EAGER, cascade = { CascadeType.MERGE, CascadeType.PERSIST })
    @JoinTable(
            name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    public User(String email, String username, String encode) {
        this.email = email;
        this.password = encode;
    }
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }
    public Set<Role> getRoles() {
        return roles;
    }


}
