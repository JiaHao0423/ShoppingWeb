package com.ben.com.backend.controller;

import com.ben.com.backend.dto.category.CategoryResponse;
import com.ben.com.backend.dto.category.CategoryUpsertRequest;
import com.ben.com.backend.dto.product.ProductResponse;
import com.ben.com.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

  @PostMapping("/admin/categories")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CategoryUpsertRequest request) {
    return ResponseEntity.ok(productService.createCategory(request));
  }

  @PutMapping("/admin/categories/{id}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<CategoryResponse> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryUpsertRequest request) {
    return ResponseEntity.ok(productService.updateCategory(id, request));
  }

  @DeleteMapping("/admin/categories/{id}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
    productService.deleteCategory(id);
    return ResponseEntity.noContent().build();
  }
}