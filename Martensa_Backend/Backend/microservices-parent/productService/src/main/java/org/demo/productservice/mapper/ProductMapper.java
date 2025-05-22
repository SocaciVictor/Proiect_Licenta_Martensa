package org.demo.productservice.mapper;

import org.demo.productservice.dto.ProductDetailsResponse;
import org.demo.productservice.dto.ProductRequest;
import org.demo.productservice.dto.ProductResponse;
import org.demo.productservice.model.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "price", expression = "java(product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice())")
    ProductResponse toProductResponse(Product product);

    @Mapping(target = "price", source = "price")
    @Mapping(target = "discountPrice", source = "discountPrice")
    ProductDetailsResponse toProductDetails(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true) // îl setăm manual în service
    Product toProduct(ProductRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true) // îl setăm separat
    void updateProductFromRequest(ProductRequest request, @MappingTarget Product product);


    List<ProductResponse> toProductResponseList(List<Product> products);
}
