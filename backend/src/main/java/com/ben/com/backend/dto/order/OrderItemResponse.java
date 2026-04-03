package com.ben.com.backend.dto.order;

import com.ben.com.backend.dto.product.ProductVariantResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
  private Long id;
  private ProductVariantResponse productVariant;
  private Integer quantity;
  private BigDecimal price;
  private BigDecimal subtotal;
}