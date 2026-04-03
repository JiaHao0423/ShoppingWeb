package com.ben.com.backend.service;

import com.ben.com.backend.dto.category.CategoryResponse;
import com.ben.com.backend.dto.product.ProductResponse;
import com.ben.com.backend.dto.product.ProductVariantResponse;
import com.ben.com.backend.exception.ResourceNotFoundException;
import com.ben.com.backend.model.Category;
import com.ben.com.backend.model.Product;
import com.ben.com.backend.model.ProductVariant;
import com.ben.com.backend.repository.CategoryRepository;
import com.ben.com.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

  private final ProductRepository productRepository;
  private final CategoryRepository categoryRepository;

  public Page<ProductResponse> getAllProducts(Long categoryId, Pageable pageable) {
    Page<Product> productsPage;
    if (categoryId != null) {
      Category category = categoryRepository.findById(categoryId)
        .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + categoryId));
      productsPage = productRepository.findByCategory(category, pageable);
    } else {
      productsPage = productRepository.findAll(pageable);
    }
    return productsPage.map(this::convertToProductResponse);
  }

  public ProductResponse getProductById(Long id) {
    Product product = productRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
    return convertToProductResponse(product);
  }

  public List<CategoryResponse> getAllCategories() {
    return categoryRepository.findAll().stream()
      .map(this::convertToCategoryResponse)
      .collect(Collectors.toList());
  }

  private ProductResponse convertToProductResponse(Product product) {
    List<ProductVariantResponse> variantResponses = product.getVariants().stream()
      .map(this::convertToProductVariantResponse)
      .collect(Collectors.toList());

    return ProductResponse.builder()
      .id(product.getId())
      .name(product.getName())
      .description(product.getDescription())
      .price(product.getPrice())
      .imageUrl(product.getImageUrl())
      .category(convertToCategoryResponse(product.getCategory()))
      .variants(variantResponses)
      .build();
  }

  private ProductVariantResponse convertToProductVariantResponse(ProductVariant variant) {
    return ProductVariantResponse.builder()
      .id(variant.getId())
      .color(variant.getColor())
      .size(variant.getSize())
      .stock(variant.getStock())
      .imageUrl(variant.getImageUrl())
      .build();
  }

  private CategoryResponse convertToCategoryResponse(Category category) {
    return CategoryResponse.builder()
      .id(category.getId())
      .name(category.getName())
      .build();
  }
}