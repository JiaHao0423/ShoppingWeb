package com.ben.com.backend.service;

import com.ben.com.backend.dto.auth.LoginRequest;
import com.ben.com.backend.dto.auth.RegisterRequest;
import com.ben.com.backend.model.User;
import com.ben.com.backend.repository.UserRepository;
import com.ben.com.backend.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;

  public User register(RegisterRequest request) {
    var user = User.builder()
      .username(request.getUsername())
      .email(request.getEmail())
      .password(passwordEncoder.encode(request.getPassword()))
      .name(request.getName())
      .roles("USER") // Default role
      .build();
    return userRepository.save(user);
  }

  public String login(LoginRequest request) {
    authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        request.getUsername(),
        request.getPassword()
      )
    );
    var user = userRepository.findByUsername(request.getUsername())
      .orElseThrow(() -> new RuntimeException("User not found")); // Should not happen after authentication
    return jwtService.generateToken(user);
  }
}