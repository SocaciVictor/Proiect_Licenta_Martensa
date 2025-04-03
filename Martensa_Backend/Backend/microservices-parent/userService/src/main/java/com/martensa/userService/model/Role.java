package com.martensa.userService.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.martensa.userService.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @NonNull
    @Enumerated(EnumType.STRING)
    @Column(length = 20, name = "role_name", unique = true)
    private UserRole roleName;

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    @JsonBackReference
    private Set<User> users = new HashSet<>();

}
