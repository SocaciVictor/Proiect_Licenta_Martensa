package com.martensa.userService.service.Impl;

import com.martensa.userService.dto.request.UserDto;

import com.martensa.userService.exception.UserAlreadyExistsException;
import com.martensa.userService.exception.UsernameNotFoundException;
import com.martensa.userService.mapper.UserMapper;
import com.martensa.userService.model.LoyaltyCard;
import com.martensa.userService.model.Role;
import com.martensa.userService.model.User;
import com.martensa.userService.model.enums.UserRole;
import com.martensa.userService.repository.LoyaltyCardRepository;
import com.martensa.userService.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.martensa.userService.repository.UserRepository;
import com.martensa.userService.service.UserService;

import java.util.Set;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final LoyaltyCardRepository loyaltyCardRepository;
    private final UserMapper userMapper;
    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);


    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, RoleRepository roleRepository, LoyaltyCardRepository loyaltyCardRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.roleRepository = roleRepository;
        this.loyaltyCardRepository = loyaltyCardRepository;
    }


    @Override
    public void createUser(UserDto userDTO) {
        User user = userMapper.toEntity(userDTO);

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User already exists");
        }

        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setIsOAuthAccount(false);

        Role customerRole = roleRepository.findByRoleName(UserRole.ROLE_CUSTOMER)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRoles(Set.of(customerRole));

        LoyaltyCard loyaltyCard = new LoyaltyCard();
        loyaltyCard.setUser(user);
        user.setLoyaltyCard(loyaltyCard);

        userRepository.save(user);
    }


    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userMapper.toDto(user);
    }
}
