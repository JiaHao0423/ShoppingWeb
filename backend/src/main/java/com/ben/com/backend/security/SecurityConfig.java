package com.ben.com.backend.security;

import com.ben.com.backend.security.jwt.JwtAuthenticationFilter;
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

import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthFilter;
  private final AuthenticationProvider authenticationProvider;

  @Value("${app.cors.allowed-origins}")
  private String corsAllowedOrigins;

  @Value("${app.frontend.base-url:}")
  private String frontendBaseUrl;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http ) {
    http
      .cors(cors -> cors.configurationSource(request -> {
        CorsConfiguration config = new CorsConfiguration( );
        config.setAllowedOrigins(resolveAllowedOrigins());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        return config;
      }))
      .csrf(AbstractHttpConfigurer::disable )
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
      return http.build( );
    } catch (Exception ex) {
      throw new IllegalStateException("Failed to build Spring Security filter chain", ex);
    }
  }

  /** 合併 CORS_ALLOWED_ORIGINS 與 FRONTEND_BASE_URL，避免 Zeabur 等部署因 Origin 不在白名單而 403 */
  private List<String> resolveAllowedOrigins() {
    Set<String> origins = new LinkedHashSet<>();
    Arrays.stream(corsAllowedOrigins.split(","))
      .map(String::trim)
      .filter(origin -> !origin.isEmpty())
      .forEach(origins::add);
    if (frontendBaseUrl != null && !frontendBaseUrl.isBlank()) {
      origins.add(frontendBaseUrl.trim());
    }
    return List.copyOf(origins);
  }
}
