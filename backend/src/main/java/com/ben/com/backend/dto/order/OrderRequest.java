package com.ben.com.backend.dto.order;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
  @NotBlank(message = "Shipping address cannot be empty")
  private String shippingAddress;

  @NotBlank(message = "Payment method cannot be empty")
  private String paymentMethod;
}