package com.ben.com.backend.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserAddressRequest {
  @NotBlank(message = "Recipient name is required")
  private String recipientName;

  @NotBlank(message = "Phone is required")
  private String phone;

  @NotBlank(message = "Address is required")
  private String address;

  private Boolean isDefault;
}
