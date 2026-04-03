package com.ben.com.backend.dto.product;

import com.ben.com.backend.dto.category.CategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
  private Long id;
  private String name;
  private String description;
  private BigDecimal price;
  private String imageUrl;
  private CategoryResponse category;
  private List<ProductVariantResponse> variants;
}