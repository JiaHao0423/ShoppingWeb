package com.ben.com.backend.controller;

import com.ben.com.backend.dto.auth.AuthResponse;
import com.ben.com.backend.dto.auth.LoginRequest;
import com.ben.com.backend.dto.auth.RegisterRequest;
import com.ben.com.backend.model.User;
import com.ben.com.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth" )
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/register")
  public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {
    User registeredUser = authService.register(request);
    return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    String jwt = authService.login(request);
    return ResponseEntity.ok(AuthResponse.builder().token(jwt).build());
  }
}