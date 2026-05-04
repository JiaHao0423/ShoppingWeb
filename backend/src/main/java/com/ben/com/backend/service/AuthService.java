package com.ben.com.backend.service;

import com.ben.com.backend.dto.auth.LoginRequest;
import com.ben.com.backend.dto.auth.RegisterRequest;
import com.ben.com.backend.dto.auth.AuthResponse;
import com.ben.com.backend.model.User;
import com.ben.com.backend.repository.UserRepository;
import com.ben.com.backend.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final PasswordResetMailService passwordResetMailService;

  public User register(RegisterRequest request) {
    var user = User.builder()
      .username(request.getUsername())
      .email(request.getEmail())
      .password(passwordEncoder.encode(request.getPassword()))
      .name(request.getName())
      .roles("USER") // Default role
      .memberLevel("BASIC")
      .build();
    return userRepository.save(user);
  }

  public AuthResponse login(LoginRequest request) {
    authenticationManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        request.getUsername(),
        request.getPassword()
      )
    );
    var user = userRepository.findByUsername(request.getUsername())
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    String refreshToken = jwtService.generateRefreshToken(user);
    user.setRefreshToken(refreshToken);
    user.setRefreshTokenExpiresAt(LocalDateTime.now().plusDays(1));
    userRepository.save(user);
    return AuthResponse.builder()
      .token(jwtService.generateToken(user))
      .refreshToken(refreshToken)
      .roles(Arrays.stream(user.getRoles().split(","))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .toList())
      .build();
  }

  public AuthResponse refreshTokens(String refreshToken) {
    var user = userRepository.findByRefreshToken(refreshToken)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

    if (user.getRefreshTokenExpiresAt() == null || user.getRefreshTokenExpiresAt().isBefore(LocalDateTime.now())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
    }

    if (!jwtService.isTokenValid(refreshToken, user)) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
    }

    String newRefreshToken = jwtService.generateRefreshToken(user);
    user.setRefreshToken(newRefreshToken);
    user.setRefreshTokenExpiresAt(LocalDateTime.now().plusDays(1));
    userRepository.save(user);

    return AuthResponse.builder()
      .token(jwtService.generateToken(user))
      .refreshToken(newRefreshToken)
      .roles(Arrays.stream(user.getRoles().split(","))
        .map(String::trim)
        .filter(s -> !s.isEmpty())
        .toList())
      .build();
  }

  public String generatePasswordResetToken(String email) {
    var user = userRepository.findByEmail(email)
      .orElse(null);

    if (user == null) {
      return null;
    }

    String resetToken = UUID.randomUUID().toString();
    user.setPasswordResetToken(resetToken);
    user.setPasswordResetExpiresAt(LocalDateTime.now().plusMinutes(30));
    userRepository.save(user);
    passwordResetMailService.sendResetPasswordEmail(user.getEmail(), resetToken);
    return resetToken;
  }

  public void resetPassword(String resetToken, String newPassword) {
    var user = userRepository.findByPasswordResetToken(resetToken)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reset token"));

    if (user.getPasswordResetExpiresAt() == null || user.getPasswordResetExpiresAt().isBefore(LocalDateTime.now())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset token expired");
    }

    user.setPassword(passwordEncoder.encode(newPassword));
    user.setPasswordResetToken(null);
    user.setPasswordResetExpiresAt(null);
    userRepository.save(user);
  }

  public String getCurrentRefreshToken(String username) {
    return userRepository.findByUsername(username)
      .map(User::getRefreshToken)
      .orElse(null);
  }

  public void clearRefreshToken(String username) {
    userRepository.findByUsername(username).ifPresent(user -> {
      user.setRefreshToken(null);
      user.setRefreshTokenExpiresAt(null);
      userRepository.save(user);
    });
  }

  public User getByUsername(String username) {
    return userRepository.findByUsername(username)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
  }

  public User getByRefreshToken(String refreshToken) {
    return userRepository.findByRefreshToken(refreshToken)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
  }
}