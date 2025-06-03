import { CartProduct } from "@/modules/cart/types/cart";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useCartStore } from "../store/useCartStore";

type Props = {
  product: CartProduct;
};

export default function CartProductCard({ product }: Props) {
  const { addProduct, removeProduct, quantities } = useCartStore();
  const quantity = quantities[product.id] || 0;

  return (
    <View className="mb-6 border-b border-gray-200 pb-4">
      <View className="flex-row items-center">
        <Image
          source={{ uri: product.imageUrl }}
          className="w-20 h-20 rounded mr-3"
          resizeMode="contain"
        />
        <View className="flex-1">
          <Text className="font-semibold">{product.name}</Text>
          <Text className="text-sm text-gray-500">
            {(product.discountPrice || product.price).toFixed(2)} Lei
          </Text>
          <View className="flex-row items-center mt-2 space-x-2">
            <TouchableOpacity
              className="bg-red-500 rounded px-2"
              onPress={() => removeProduct(product.id)}
            >
              <Text className="text-white font-bold text-lg">−</Text>
            </TouchableOpacity>
            <Text>{quantity}</Text>
            <TouchableOpacity
              className="bg-green-600 rounded px-2"
              onPress={() => addProduct(product.id)}
            >
              <Text className="text-white font-bold text-lg">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
