package com.ben.com.backend.repository;

import com.ben.com.backend.model.Cart;
import com.ben.com.backend.model.CartItem;
import com.ben.com.backend.model.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
  Optional<CartItem> findByCartAndProductVariant(Cart cart, ProductVariant productVariant);
}
