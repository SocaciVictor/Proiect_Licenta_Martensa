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

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "price", expression = "java(product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice())")
    ProductResponse toProductResponse(Product product);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "brand", source = "brand")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "discountPrice", source = "discountPrice")
    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "barcode", source = "barcode")
    @Mapping(target = "ingredients", source = "ingredients")
    @Mapping(target = "nutritionalInfo", source = "nutritionalInfo")
    @Mapping(target = "disclaimer", source = "disclaimer")
    @Mapping(target = "alcoholPercentage", source = "alcoholPercentage")
    @Mapping(target = "categoryName",     source = "category.name")
    ProductDetailsResponse toProductDetails(Product product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "brand", source = "brand")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "discountPrice", source = "discountPrice")
    @Mapping(target = "imageUrl", source = "imageUrl")
    @Mapping(target = "barcode", source = "barcode")
    @Mapping(target = "ingredients", source = "ingredients")
    @Mapping(target = "nutritionalInfo", source = "nutritionalInfo")
    @Mapping(target = "disclaimer", source = "disclaimer")
    @Mapping(target = "alcoholPercentage", source = "alcoholPercentage")
    @Mapping(target = "category", ignore = true)
    Product toProduct(ProductRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    void updateProductFromRequest(ProductRequest request, @MappingTarget Product product);

    List<ProductResponse> toProductResponseList(List<Product> products);
}
