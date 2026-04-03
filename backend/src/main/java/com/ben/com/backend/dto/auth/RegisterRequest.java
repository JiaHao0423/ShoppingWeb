package com.ben.com.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  @NotBlank(message = "Username cannot be empty")
  @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
  private String username;

  @NotBlank(message = "Password cannot be empty")
  @Size(min = 6, message = "Password must be at least 6 characters long")
  private String password;

  @Email(message = "Invalid email format")
  @NotBlank(message = "Email cannot be empty")
  private String email;

  @NotBlank(message = "Name cannot be empty")
  private String name;
}