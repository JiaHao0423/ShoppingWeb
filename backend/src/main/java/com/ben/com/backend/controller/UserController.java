package com.ben.com.backend.controller;

import com.ben.com.backend.dto.user.UserUpdateRequest;
import com.ben.com.backend.model.User;
import com.ben.com.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users" )
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;

  @GetMapping("/me")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<User> getCurrentUser() {
    User user = userService.getCurrentUser();
    return ResponseEntity.ok(user);
  }

  @PutMapping("/me")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<User> updateCurrentUser(@Valid @RequestBody UserUpdateRequest request) {
    User updatedUser = userService.updateCurrentUser(request);
    return ResponseEntity.ok(updatedUser);
  }
}