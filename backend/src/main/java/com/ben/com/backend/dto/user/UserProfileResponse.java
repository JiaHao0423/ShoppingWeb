package com.ben.com.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
  private Long id;
  private String username;
  private String email;
  private String name;
  private String phone;
  private String address;
  private String idCardNumber;
  private LocalDate birthday;
  private Boolean gender;
  private String avatarUrl;
  private String memberLevel;
  private List<String> roles;
  private LocalDateTime createdAt;
}
