package com.ben.com.backend.service;

import com.ben.com.backend.dto.category.CategoryResponse;
import com.ben.com.backend.dto.category.CategoryUpsertRequest;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;

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

  @Transactional
  public CategoryResponse createCategory(CategoryUpsertRequest request) {
    String categoryName = request.getName().trim();
    if (categoryRepository.existsByNameIgnoreCase(categoryName)) {
      throw new ResponseStatusException(CONFLICT, "Category name already exists.");
    }

    Category category = new Category();
    category.setName(categoryName);
    category.setParentCategory(normalizeParentCategory(request.getParentCategory()));
    Category saved = categoryRepository.save(category);
    return convertToCategoryResponse(saved);
  }

  @Transactional
  public CategoryResponse updateCategory(Long id, CategoryUpsertRequest request) {
    Category category = categoryRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));

    String categoryName = request.getName().trim();
    if (categoryRepository.existsByNameIgnoreCaseAndIdNot(categoryName, id)) {
      throw new ResponseStatusException(CONFLICT, "Category name already exists.");
    }

    category.setName(categoryName);
    category.setParentCategory(normalizeParentCategory(request.getParentCategory()));
    Category saved = categoryRepository.save(category);
    return convertToCategoryResponse(saved);
  }

  @Transactional
  public void deleteCategory(Long id) {
    if (!categoryRepository.existsById(id)) {
      throw new ResourceNotFoundException("Category not found with id " + id);
    }
    long productCount = productRepository.countByCategoryId(id);
    if (productCount > 0) {
      throw new ResponseStatusException(BAD_REQUEST, "Cannot delete category with products.");
    }
    categoryRepository.deleteById(id);
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
      .parentCategory(category.getParentCategory())
      .build();
  }

  private String normalizeParentCategory(String value) {
    if (value == null || value.isBlank()) {
      return "others";
    }
    return switch (value.trim()) {
      case "tops", "bottoms", "onePiece", "others" -> value.trim();
      default -> throw new ResponseStatusException(BAD_REQUEST, "Invalid parentCategory.");
    };
  }
}