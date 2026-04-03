package com.ben.com.backend.service;

import com.ben.com.backend.dto.order.OrderItemResponse;
import com.ben.com.backend.dto.order.OrderRequest;
import com.ben.com.backend.dto.order.OrderResponse;
import com.ben.com.backend.dto.product.ProductVariantResponse;
import com.ben.com.backend.exception.BadRequestException;
import com.ben.com.backend.exception.ResourceNotFoundException;
import com.ben.com.backend.model.*;
import com.ben.com.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

  private final OrderRepository orderRepository;
  private final OrderItemRepository orderItemRepository;
  private final CartRepository cartRepository;
  private final CartItemRepository cartItemRepository;
  private final ProductVariantRepository productVariantRepository;
  private final UserService userService;

  @Transactional
  public OrderResponse createOrder(OrderRequest request) {
    User currentUser = userService.getCurrentUser();
    Cart cart = cartRepository.findByUser(currentUser)
      .orElseThrow(() -> new BadRequestException("Cart not found for current user"));

    List<CartItem> cartItems = cart.getCartItems();
    if (cartItems.isEmpty()) {
      throw new BadRequestException("Cannot create order from an empty cart");
    }

    // Check stock and calculate total amount
    BigDecimal totalAmount = BigDecimal.ZERO;
    for (CartItem item : cartItems) {
      ProductVariant variant = item.getProductVariant();
      if (variant.getStock() < item.getQuantity()) {
        throw new BadRequestException("Not enough stock for product " + variant.getProduct().getName() + " (Variant: " + variant.getColor() + ", " + variant.getSize() + ")");
      }
      totalAmount = totalAmount.add(variant.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
    }

    // Create Order
    Order order = Order.builder()
      .user(currentUser)
      .orderDate(LocalDateTime.now())
      .totalAmount(totalAmount)
      .status("PENDING") // Initial status
      .shippingAddress(request.getShippingAddress())
      .paymentMethod(request.getPaymentMethod())
      .build();
    order = orderRepository.save(order);

    // Create Order Items and update stock
    for (CartItem item : cartItems) {
      ProductVariant variant = item.getProductVariant();
      OrderItem orderItem = OrderItem.builder()
        .order(order)
        .productVariant(variant)
        .quantity(item.getQuantity())
        .price(variant.getProduct().getPrice())
        .build();
      orderItemRepository.save(orderItem);

      // Deduct stock
      variant.setStock(variant.getStock() - item.getQuantity());
      productVariantRepository.save(variant);
    }

    // Clear cart
    cartItemRepository.deleteAll(cartItems);
    cartRepository.delete(cart);

    return convertToOrderResponse(order);
  }

  public List<OrderResponse> getOrdersForCurrentUser() {
    User currentUser = userService.getCurrentUser();
    return orderRepository.findByUser(currentUser).stream()
      .map(this::convertToOrderResponse)
      .collect(Collectors.toList());
  }

  public OrderResponse getOrderById(Long id) {
    User currentUser = userService.getCurrentUser();
    Order order = orderRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + id));

    if (!order.getUser().getId().equals(currentUser.getId())) {
      throw new BadRequestException("Order does not belong to current user");
    }
    return convertToOrderResponse(order);
  }

  @Transactional
  public OrderResponse updateOrderStatus(Long id, String status) {
    Order order = orderRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Order not found with id " + id));
    order.setStatus(status);
    return convertToOrderResponse(orderRepository.save(order));
  }

  private OrderResponse convertToOrderResponse(Order order) {
    List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
      .map(this::convertToOrderItemResponse)
      .collect(Collectors.toList());

    return OrderResponse.builder()
      .id(order.getId())
      .userId(order.getUser().getId())
      .orderDate(order.getOrderDate())
      .totalAmount(order.getTotalAmount())
      .status(order.getStatus())
      .shippingAddress(order.getShippingAddress())
      .paymentMethod(order.getPaymentMethod())
      .items(itemResponses)
      .build();
  }

  private OrderItemResponse convertToOrderItemResponse(OrderItem orderItem) {
    ProductVariant productVariant = orderItem.getProductVariant();
    return OrderItemResponse.builder()
      .id(orderItem.getId())
      .productVariant(ProductVariantResponse.builder()
        .id(productVariant.getId())
        .color(productVariant.getColor())
        .size(productVariant.getSize())
        .stock(productVariant.getStock())
        .imageUrl(productVariant.getImageUrl())
        .build())
      .quantity(orderItem.getQuantity())
      .price(orderItem.getPrice())
      .subtotal(orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())))
      .build();
  }
}