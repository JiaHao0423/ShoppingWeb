package com.ben.com.backend.controller;

import com.ben.com.backend.dto.order.OrderRequest;
import com.ben.com.backend.dto.order.OrderResponse;
import com.ben.com.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders" )
@RequiredArgsConstructor
public class OrderController {

  private final OrderService orderService;

  @PostMapping
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest request) {
    return new ResponseEntity<>(orderService.createOrder(request), HttpStatus.CREATED);
  }

  @GetMapping
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<List<OrderResponse>> getOrdersForCurrentUser() {
    return ResponseEntity.ok(orderService.getOrdersForCurrentUser());
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
    return ResponseEntity.ok(orderService.getOrderById(id));
  }

  @PutMapping("/{id}/status")
  @PreAuthorize("hasAuthority('ADMIN')") // Only admin can update order status
  public ResponseEntity<OrderResponse> updateOrderStatus(
    @PathVariable Long id,
    @RequestParam String status) {
    return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
  }
}