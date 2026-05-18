package com.ben.com.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(ResourceNotFoundException ex) {
    return ResponseEntity.status(HttpStatus.NOT_FOUND)
      .body(errorBody(messageOrDefault(ex, "Resource not found")));
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<Map<String, Object>> handleBadRequestException(BadRequestException ex) {
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
      .body(errorBody(messageOrDefault(ex, "Bad request")));
  }

  @ExceptionHandler({ BadCredentialsException.class, UsernameNotFoundException.class })
  public ResponseEntity<Map<String, Object>> handleAuthenticationFailure() {
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
      .body(errorBody("帳號或密碼錯誤"));
  }

  @ExceptionHandler(ResponseStatusException.class)
  public ResponseEntity<Map<String, Object>> handleResponseStatusException(ResponseStatusException ex) {
    String message = Objects.requireNonNullElse(ex.getReason(), messageOrDefault(ex, "Request failed"));
    return ResponseEntity.status(ex.getStatusCode())
      .body(errorBody(message));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .body(errorBody("An unexpected error occurred: " + messageOrDefault(ex, "Unknown error")));
  }

  private static Map<String, Object> errorBody(String message) {
    Map<String, Object> body = new LinkedHashMap<>();
    body.put("timestamp", LocalDateTime.now());
    body.put("message", message);
    return body;
  }

  private static String messageOrDefault(Exception ex, String fallback) {
    return Objects.requireNonNullElse(ex.getMessage(), fallback);
  }
}
