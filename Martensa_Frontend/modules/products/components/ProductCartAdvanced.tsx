import { ProductResponse } from "@/modules/auth/types/auth";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  product: ProductResponse;
};

export default function ProductCardAdvanced({ product }: Props) {
  const { quantities, addProduct, removeProduct, fetchCart } = useCartStore();
  const quantity = quantities[product.id] || 0;

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <View className="bg-white rounded-lg p-2 border border-gray-200 w-[48%]">
      <Image
        source={{ uri: product.imageUrl }}
        className="h-28 w-full object-contain rounded"
      />
      <Text className="text-sm font-semibold mt-2">{product.name}</Text>
      <Text className="text-xs text-gray-600 mt-1">
        {product.price.toFixed(2)} Lei
      </Text>

      {quantity > 0 ? (
        <View className="flex-row justify-between items-center mt-2 bg-gray-100 rounded">
          <TouchableOpacity
            className="px-3 py-1"
            onPress={() => removeProduct(product.id)}
          >
            <Text className="text-red-500 text-lg font-bold">−</Text>
          </TouchableOpacity>
          <Text className="text-base font-semibold">{quantity}</Text>
          <TouchableOpacity
            className="px-3 py-1"
            onPress={() => addProduct(product.id)}
          >
            <Text className="text-green-600 text-lg font-bold">+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="bg-green-600 mt-2 py-1 rounded"
          onPress={() => addProduct(product.id)}
        >
          <Text className="text-center text-white font-semibold text-sm">
            Adaugă
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
