package com.ben.com.backend.controller;

import com.ben.com.backend.dto.auth.AuthResponse;
import com.ben.com.backend.dto.auth.ForgotPasswordRequest;
import com.ben.com.backend.dto.auth.LoginRequest;
import com.ben.com.backend.dto.auth.MessageResponse;
import com.ben.com.backend.dto.auth.RefreshTokenRequest;
import com.ben.com.backend.dto.auth.RegisterRequest;
import com.ben.com.backend.dto.auth.ResetPasswordRequest;
import com.ben.com.backend.model.User;
import com.ben.com.backend.service.AuthService;
import com.ben.com.backend.service.AuthRateLimitService;
import com.ben.com.backend.service.PasswordResetMailService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

@RestController
@RequestMapping("/auth" )
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;
  private final AuthRateLimitService authRateLimitService;
  private final PasswordResetMailService passwordResetMailService;

  @PostMapping("/register")
  public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest request) {
    User registeredUser = authService.register(request);
    return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }

  @PostMapping("/refresh")
  public ResponseEntity<AuthResponse> refresh(@Valid @RequestBody RefreshTokenRequest request) {
    return ResponseEntity.ok(authService.refreshTokens(request.getRefreshToken()));
  }

  @PostMapping("/logout")
  public ResponseEntity<MessageResponse> logout(Authentication authentication) {
    if (authentication != null && authentication.getName() != null) {
      authService.clearRefreshToken(authentication.getName());
    }
    return ResponseEntity.ok(new MessageResponse("Logout successful"));
  }

  @PostMapping("/forgot-password")
  public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request, HttpServletRequest httpRequest) {
    if (!authRateLimitService.isForgotPasswordAllowed(getClientIp(httpRequest))) {
      throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many forgot-password attempts. Please try again later.");
    }
    authService.generatePasswordResetToken(request.getEmail());
    return ResponseEntity.ok(new MessageResponse("If the email exists, reset instructions were generated."));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request, HttpServletRequest httpRequest) {
    if (!authRateLimitService.isResetPasswordAllowed(getClientIp(httpRequest))) {
      throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many reset-password attempts. Please try again later.");
    }
    authService.resetPassword(request.getToken(), request.getNewPassword());
    return ResponseEntity.ok(new MessageResponse("Password reset successful."));
  }

  @PostMapping("/mail-health")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<MessageResponse> mailHealth(Authentication authentication) {
    if (authentication == null || authentication.getName() == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }
    User user = authService.getByUsername(authentication.getName());
    passwordResetMailService.sendMailHealthCheckEmail(user.getEmail());
    return ResponseEntity.ok(new MessageResponse("Mail health-check email sent."));
  }

  @GetMapping("/mail-debug")
  public ResponseEntity<Map<String, Object>> mailDebug() {
    return ResponseEntity.ok(passwordResetMailService.getMailDebugInfo());
  }

  private String getClientIp(HttpServletRequest request) {
    String forwarded = request.getHeader("X-Forwarded-For");
    if (forwarded != null && !forwarded.isBlank()) {
      return forwarded.split(",")[0].trim();
    }
    return request.getRemoteAddr();
  }
}