package com.ben.com.backend.dto.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
  private Long id;
  private Long userId;
  private LocalDateTime orderDate;
  private BigDecimal totalAmount;
  private String status;
  private String shippingAddress;
  private String paymentMethod;
  private List<OrderItemResponse> items;
}