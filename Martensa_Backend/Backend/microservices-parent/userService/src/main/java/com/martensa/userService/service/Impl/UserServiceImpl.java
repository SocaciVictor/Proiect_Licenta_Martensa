package com.martensa.userService.service.Impl;

import com.martensa.userService.dto.request.UserDto;

import com.martensa.userService.exception.UserAlreadyExistsException;
import com.martensa.userService.exception.UsernameNotFoundException;
import com.martensa.userService.mapper.UserMapper;
import com.martensa.userService.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.martensa.userService.repository.UserRepository;
import com.martensa.userService.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);


    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }


    @Override
    public void createUser(UserDto userDTO) {
        User user = userMapper.toEntity(userDTO);

        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new UserAlreadyExistsException("User already exists");
        }

        userRepository.save(user);
    }

    @Override
    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userMapper.toDto(user);
    }
}
