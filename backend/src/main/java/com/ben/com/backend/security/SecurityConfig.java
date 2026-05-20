package com.ben.com.backend.security;

import com.ben.com.backend.security.jwt.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.net.URI;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private static final List<String> DEFAULT_ORIGIN_PATTERNS = List.of(
    "http://localhost:*",
    "http://127.0.0.1:*",
    "https://*.zeabur.app"
  );

  private final JwtAuthenticationFilter jwtAuthFilter;
  private final AuthenticationProvider authenticationProvider;

  @Value("${app.cors.allowed-origins}")
  private String corsAllowedOrigins;

  @Value("${app.frontend.base-url:}")
  private String frontendBaseUrl;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) {
    http
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .csrf(AbstractHttpConfigurer::disable)
      .authorizeHttpRequests(auth -> auth
        .requestMatchers("/", "/health").permitAll()
        .requestMatchers("/auth/**").permitAll()
        .requestMatchers("/products/**").permitAll()
        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
        .anyRequest().authenticated()
      )
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
      .authenticationProvider(authenticationProvider)
      .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    try {
      return http.build();
    } catch (Exception ex) {
      throw new IllegalStateException("Failed to build Spring Security filter chain", ex);
    }
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    return request -> buildCorsConfiguration(request);
  }

  private CorsConfiguration buildCorsConfiguration(HttpServletRequest request) {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOriginPatterns(new ArrayList<>(DEFAULT_ORIGIN_PATTERNS));
    config.setAllowedOrigins(new ArrayList<>(resolveExplicitOrigins(request)));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    return config;
  }

  private Set<String> resolveExplicitOrigins(HttpServletRequest request) {
    Set<String> origins = new LinkedHashSet<>();
    Arrays.stream(corsAllowedOrigins.split(","))
      .map(SecurityConfig::normalizeOrigin)
      .filter(origin -> !origin.isEmpty())
      .forEach(origins::add);
    String normalizedFrontend = normalizeOrigin(frontendBaseUrl);
    if (!normalizedFrontend.isEmpty()) {
      origins.add(normalizedFrontend);
    }
    String originHeader = request.getHeader("Origin");
    if (originHeader != null && isSameHostAsRequest(request, originHeader)) {
      origins.add(normalizeOrigin(originHeader));
    }
    return origins;
  }

  /** 與請求同 host 的 Origin（全端同網域部署）一律放行，不依賴環境變數 */
  private static boolean isSameHostAsRequest(HttpServletRequest request, String origin) {
    try {
      String originHost = URI.create(origin).getHost();
      if (originHost == null || originHost.isBlank()) {
        return false;
      }
      String requestHost = request.getHeader("X-Forwarded-Host");
      if (requestHost == null || requestHost.isBlank()) {
        requestHost = request.getServerName();
      } else {
        requestHost = requestHost.split(",")[0].trim();
      }
      int portIdx = requestHost.indexOf(':');
      if (portIdx > 0) {
        requestHost = requestHost.substring(0, portIdx);
      }
      return originHost.equalsIgnoreCase(requestHost);
    } catch (Exception ex) {
      return false;
    }
  }

  private static String normalizeOrigin(String value) {
    if (value == null) {
      return "";
    }
    String trimmed = value.trim();
    while (trimmed.endsWith("/")) {
      trimmed = trimmed.substring(0, trimmed.length() - 1);
    }
    return trimmed;
  }
}
