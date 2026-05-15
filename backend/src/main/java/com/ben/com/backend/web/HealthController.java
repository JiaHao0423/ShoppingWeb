package com.ben.com.backend.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

  @GetMapping("/")
  public ResponseEntity<Map<String, String>> root() {
    return ResponseEntity.ok(Map.of(
      "service", "shopping-web-backend",
      "status", "UP",
      "api", "/api",
      "swagger", "/api/swagger-ui.html"
    ));
  }

  @GetMapping("/health")
  public ResponseEntity<Map<String, String>> health() {
    return ResponseEntity.ok(Map.of("status", "UP"));
  }
}
