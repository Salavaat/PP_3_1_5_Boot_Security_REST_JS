package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {


    List<User> getAllUsers();

    User findByEmail(String email);


    Optional<User> findUserById(Long id);

    void saveUser(User user);

    void updateUser(Long id, User user);

    void delete(Long id);
}
