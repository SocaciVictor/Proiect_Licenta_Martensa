package org.demo.productservice.service;

import org.demo.productservice.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getAllCategories();
}
