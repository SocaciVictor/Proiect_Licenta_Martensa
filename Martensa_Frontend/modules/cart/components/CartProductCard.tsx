import { CartProduct } from "@/modules/cart/types/cart";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  product: CartProduct;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function CartProductCard({
  product,
  quantity,
  onIncrement,
  onDecrement,
}: Props) {
  const price = (product.discountPrice || product.price).toFixed(2);

  return (
    <View className="flex-row items-center justify-between bg-white p-4 border-b border-gray-200">
      {/* Imagine produs */}
      <Image
        source={{ uri: product.imageUrl }}
        className="w-16 h-16 rounded-md"
        resizeMode="contain"
      />

      {/* Nume + Preț */}
      <View className="flex-1 ml-4">
        <Text className="text-base font-semibold text-black">
          {product.name}
        </Text>
        <Text className="text-sm text-green-700">{price} Lei</Text>
      </View>

      {/* Butoane + / - */}
      <View className="flex-row items-center space-x-2">
        <TouchableOpacity
          onPress={onDecrement}
          className="w-10 h-10 border border-[#28a745] rounded-sm bg-white items-center justify-center"
        >
          <Ionicons name="remove" size={20} color="#28a745" />
        </TouchableOpacity>

        <Text className="w-6 text-center text-base font-semibold">
          {quantity}
        </Text>

        <TouchableOpacity
          onPress={onIncrement}
          className="w-10 h-10 border border-[#28a745] rounded-sm bg-white items-center justify-center"
        >
          <Ionicons name="add" size={20} color="#28a745" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
