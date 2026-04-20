package com.ben.com.backend.service;

import com.ben.com.backend.dto.cart.CartItemRequest;
import com.ben.com.backend.dto.cart.CartItemResponse;
import com.ben.com.backend.dto.cart.CartResponse;
import com.ben.com.backend.dto.product.ProductVariantResponse;
import com.ben.com.backend.exception.BadRequestException;
import com.ben.com.backend.exception.ResourceNotFoundException;
import com.ben.com.backend.model.*;
import com.ben.com.backend.repository.CartItemRepository;
import com.ben.com.backend.repository.CartRepository;
import com.ben.com.backend.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

  private final CartRepository cartRepository;
  private final CartItemRepository cartItemRepository;
  private final ProductVariantRepository productVariantRepository;
  private final UserService userService;

  @Transactional
  public CartResponse getOrCreateCartForCurrentUser() {
    User currentUser = userService.getCurrentUser();
    Cart cart = cartRepository.findByUser(currentUser)
      .orElseGet(() -> {
        Cart newCart = Cart.builder().user(currentUser).build();
        return cartRepository.save(newCart);
      });
    return convertToCartResponse(cart);
  }

  @Transactional
  public CartResponse addOrUpdateCartItem(CartItemRequest request) {
    User currentUser = userService.getCurrentUser();
    Cart cart = cartRepository.findByUser(currentUser)
      .orElseThrow(() -> new ResourceNotFoundException("Cart not found for current user"));

    ProductVariant productVariant = productVariantRepository.findById(request.getProductVariantId())
      .orElseThrow(() -> new ResourceNotFoundException("Product variant not found with id " + request.getProductVariantId()));

    if (productVariant.getStock() < request.getQuantity()) {
      throw new BadRequestException("Not enough stock for product variant " + productVariant.getId());
    }

    Optional<CartItem> existingCartItem = cartItemRepository.findByCartAndProductVariant(cart, productVariant);

    CartItem cartItem;
    if (existingCartItem.isPresent()) {
      cartItem = existingCartItem.get();
      cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
    } else {
      cartItem = CartItem.builder()
        .cart(cart)
        .productVariant(productVariant)
        .quantity(request.getQuantity())
        .build();
    }
    cartItemRepository.save(cartItem);
    return convertToCartResponse(cart);
  }

  @Transactional
  public CartResponse updateCartItemQuantity(Long cartItemId, Integer quantity) {
    User currentUser = userService.getCurrentUser();
    Cart cart = cartRepository.findByUser(currentUser)
      .orElseThrow(() -> new ResourceNotFoundException("Cart not found for current user"));

    CartItem cartItem = cartItemRepository.findById(cartItemId)
      .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id " + cartItemId));

    if (!cartItem.getCart().getId().equals(cart.getId())) {
      throw new BadRequestException("Cart item does not belong to current user's cart");
    }

    if (cartItem.getProductVariant().getStock() < quantity) {
      throw new BadRequestException("Not enough stock for product variant " + cartItem.getProductVariant().getId());
    }

    cartItem.setQuantity(quantity);
    cartItemRepository.save(cartItem);
    return convertToCartResponse(cart);
  }

  @Transactional
  public void removeCartItem(Long cartItemId) {
    User currentUser = userService.getCurrentUser();
    Cart cart = cartRepository.findByUser(currentUser)
      .orElseThrow(() -> new ResourceNotFoundException("Cart not found for current user"));

    CartItem cartItem = cartItemRepository.findById(cartItemId)
      .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id " + cartItemId));

    if (!cartItem.getCart().getId().equals(cart.getId())) {
      throw new BadRequestException("Cart item does not belong to current user's cart");
    }
    cartItemRepository.delete(cartItem);
  }

  private CartResponse convertToCartResponse(Cart cart) {
    List<CartItemResponse> itemResponses = cart.getCartItems().stream()
      .map(this::convertToCartItemResponse)
      .collect(Collectors.toList());

    BigDecimal totalAmount = itemResponses.stream()
      .map(CartItemResponse::getSubtotal)
      .reduce(BigDecimal.ZERO, BigDecimal::add);

    return CartResponse.builder()
      .id(cart.getId())
      .items(itemResponses)
      .totalAmount(totalAmount)
      .build();
  }

  private CartItemResponse convertToCartItemResponse(CartItem cartItem) {
    ProductVariant productVariant = cartItem.getProductVariant();
    Product product = productVariant.getProduct();
    BigDecimal subtotal = productVariant.getProduct().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));

    return CartItemResponse.builder()
      .id(cartItem.getId())
      .productVariant(ProductVariantResponse.builder()
        .id(productVariant.getId())
        .color(productVariant.getColor())
        .size(productVariant.getSize())
        .stock(productVariant.getStock())
        .imageUrl(productVariant.getImageUrl() != null ? productVariant.getImageUrl() : product.getImageUrl())
        .productName(product.getName())
        .price(product.getPrice())
        .build())
      .quantity(cartItem.getQuantity())
      .subtotal(subtotal)
      .build();
  }
}