package com.ben.com.backend.controller;

import com.ben.com.backend.dto.category.CategoryResponse;
import com.ben.com.backend.dto.product.ProductResponse;
import com.ben.com.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products" )
@RequiredArgsConstructor
public class ProductController {

  private final ProductService productService;

  @GetMapping
  public ResponseEntity<Page<ProductResponse>> getAllProducts(
    @RequestParam(required = false) Long categoryId,
    Pageable pageable) {
    return ResponseEntity.ok(productService.getAllProducts(categoryId, pageable));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
    return ResponseEntity.ok(productService.getProductById(id));
  }

  @GetMapping("/categories")
  public ResponseEntity<List<CategoryResponse>> getAllCategories() {
    return ResponseEntity.ok(productService.getAllCategories());
  }
}