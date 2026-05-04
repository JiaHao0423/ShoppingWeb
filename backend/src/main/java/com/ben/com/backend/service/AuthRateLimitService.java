package com.ben.com.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthRateLimitService {

  private final StringRedisTemplate redisTemplate;

  @Value("${app.security.rate-limit.forgot.max-attempts:5}")
  private int forgotMaxAttempts;

  @Value("${app.security.rate-limit.forgot.window-minutes:15}")
  private int forgotWindowMinutes;

  @Value("${app.security.rate-limit.reset.max-attempts:8}")
  private int resetMaxAttempts;

  @Value("${app.security.rate-limit.reset.window-minutes:15}")
  private int resetWindowMinutes;

  public boolean isForgotPasswordAllowed(String key) {
    return isAllowed("forgot:" + key, forgotMaxAttempts, forgotWindowMinutes, "forgot-password");
  }

  public boolean isResetPasswordAllowed(String key) {
    return isAllowed("reset:" + key, resetMaxAttempts, resetWindowMinutes, "reset-password");
  }

  private boolean isAllowed(String key, int maxAttempts, int windowMinutes, String actionName) {
    String redisKey = "rate-limit:" + key;
    try {
      Long count = redisTemplate.opsForValue().increment(redisKey);
      if (count == null) {
        return true;
      }
      if (count == 1L) {
        redisTemplate.expire(redisKey, Duration.ofMinutes(windowMinutes));
      }
      return count <= maxAttempts;
    } catch (Exception ex) {
      log.warn("Redis rate-limit unavailable for action {} and key {}, allow request by fallback.", actionName, key, ex);
      return true;
    }
  }
}
