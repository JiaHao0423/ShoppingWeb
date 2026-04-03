package com.ben.com.backend.dto.cart;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemRequest {
  @NotNull(message = "Product variant ID cannot be null")
  private Long productVariantId;

  @Min(value = 1, message = "Quantity must be at least 1")
  private Integer quantity;
}