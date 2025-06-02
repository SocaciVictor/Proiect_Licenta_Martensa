import { useCart } from "@/modules/cart/hooks/useCart";
import { CartProduct } from "@/modules/cart/types/cart";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  product: CartProduct;
  quantity: number;
};

export default function CartProductCard({ product, quantity }: Props) {
  const { addProduct, removeProduct } = useCart();

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
