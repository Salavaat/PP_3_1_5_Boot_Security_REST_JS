package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.exception_handling.UserNotFoundException;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminsRESTController {

    private final UserService userService;

    private final RoleService roleService;

    @Autowired
    public AdminsRESTController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping()
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }


    @GetMapping("/roles")
    public ResponseEntity<List<Role>> allRoles() {
        List<Role> roleList = roleService.getListRoles();
        return ResponseEntity.ok(roleList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(userService.findUserById(id).get());
    }

    @PostMapping("/create")
    public ResponseEntity<User> create(@RequestBody User user) {
        userService.saveUser(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PatchMapping()
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        userService.saveUser(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        Optional<User> user = userService.findUserById(id);
        if (user.isEmpty()) {
            throw new UserNotFoundException("There is no user with ID = " + id + " in DataBase");
        }
        userService.delete(id);
        return "User with ID =" + id + "was deleted";
    }
}