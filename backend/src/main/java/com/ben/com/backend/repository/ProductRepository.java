package com.ben.com.backend.repository;

import com.ben.com.backend.model.Category;
import com.ben.com.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface ProductRepository extends JpaRepository<Product, Long> {
  Page<Product> findByCategory(Category category, Pageable pageable);
}
