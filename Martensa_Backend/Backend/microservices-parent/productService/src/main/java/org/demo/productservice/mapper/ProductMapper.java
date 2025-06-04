package org.demo.productservice.mapper;

import org.demo.productservice.dto.ProductDetailsResponse;
import org.demo.productservice.dto.ProductRequest;
import org.demo.productservice.dto.ProductResponse;
import org.demo.productservice.dto.PromotionDto;
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

    @Mapping(target = "id", source = "product.id")
    @Mapping(target = "name", source = "product.name")
    @Mapping(target = "description", source = "product.description")
    @Mapping(target = "brand", source = "product.brand")
    @Mapping(target = "price", source = "product.price")
    @Mapping(target = "discountPrice", source = "product.discountPrice")
    @Mapping(target = "imageUrl", source = "product.imageUrl")
    @Mapping(target = "barcode", source = "product.barcode")
    @Mapping(target = "ingredients", source = "product.ingredients")
    @Mapping(target = "nutritionalInfo", source = "product.nutritionalInfo")
    @Mapping(target = "disclaimer", source = "product.disclaimer")
    @Mapping(target = "alcoholPercentage", source = "product.alcoholPercentage")
    @Mapping(target = "categoryName", source = "product.category.name")
    @Mapping(target = "promotions", ignore = true)
    ProductDetailsResponse toProductDetails(Product product);

    @Mapping(target = "id", source = "product.id")
    @Mapping(target = "name", source = "product.name")
    @Mapping(target = "description", source = "product.description")
    @Mapping(target = "brand", source = "product.brand")
    @Mapping(target = "price", source = "product.price")
    @Mapping(target = "discountPrice", source = "product.discountPrice")
    @Mapping(target = "imageUrl", source = "product.imageUrl")
    @Mapping(target = "barcode", source = "product.barcode")
    @Mapping(target = "ingredients", source = "product.ingredients")
    @Mapping(target = "nutritionalInfo", source = "product.nutritionalInfo")
    @Mapping(target = "disclaimer", source = "product.disclaimer")
    @Mapping(target = "alcoholPercentage", source = "product.alcoholPercentage")
    @Mapping(target = "categoryName", source = "product.category.name")
    @Mapping(target = "promotions", source = "promotions")
    ProductDetailsResponse toProductDetails(Product product, List<PromotionDto> promotions);

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
