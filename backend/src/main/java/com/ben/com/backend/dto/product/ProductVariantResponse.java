package com.ben.com.backend.dto.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantResponse {
  private Long id;
  private String color;
  private String size;
  private Integer stock;
  private String imageUrl;
  private String productName;
  private java.math.BigDecimal price;
}