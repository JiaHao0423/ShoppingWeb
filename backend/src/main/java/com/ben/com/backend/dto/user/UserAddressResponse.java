package com.ben.com.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserAddressResponse {
  private Long id;
  private String recipientName;
  private String phone;
  private String address;
  private boolean isDefault;
}
