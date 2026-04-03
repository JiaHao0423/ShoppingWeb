package com.ben.com.backend.controller;

import com.ben.com.backend.dto.cart.CartItemRequest;
import com.ben.com.backend.dto.cart.CartResponse;
import com.ben.com.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/carts" )
@RequiredArgsConstructor
public class CartController {

  private final CartService cartService;

  @GetMapping
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<CartResponse> getCart() {
    return ResponseEntity.ok(cartService.getOrCreateCartForCurrentUser());
  }

  @PostMapping("/items")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<CartResponse> addOrUpdateItem(@Valid @RequestBody CartItemRequest request) {
    return new ResponseEntity<>(cartService.addOrUpdateCartItem(request), HttpStatus.OK);
  }

  @PutMapping("/items/{cartItemId}")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<CartResponse> updateItemQuantity(
    @PathVariable Long cartItemId,
    @RequestParam Integer quantity) {
    return ResponseEntity.ok(cartService.updateCartItemQuantity(cartItemId, quantity));
  }

  @DeleteMapping("/items/{cartItemId}")
  @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
  public ResponseEntity<Void> removeItem(@PathVariable Long cartItemId) {
    cartService.removeCartItem(cartItemId);
    return ResponseEntity.noContent().build();
  }
}