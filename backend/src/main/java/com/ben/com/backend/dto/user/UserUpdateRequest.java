package com.ben.com.backend.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequest {

  @NotBlank(message = "Name cannot be empty")
  private String name;

  private String phone;

  private String address;

  @Size(min = 10, max = 10, message = "ID card number must be 10 characters long")
  private String idCardNumber;

  @PastOrPresent(message = "Birthday cannot be in the future")
  private LocalDate birthday;

  private Boolean gender;

  private String avatarUrl;
}