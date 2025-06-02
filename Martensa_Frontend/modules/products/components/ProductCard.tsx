// modules/products/components/ProductCard.tsx
import { ProductResponse } from "@/modules/auth/types/auth";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  product: ProductResponse;
  onAddToCart: () => void;
};

export default function ProductCard({ product, onAddToCart }: Props) {
  return (
    <View className="bg-white rounded-lg p-2 border border-gray-200 w-[48%]">
      <Image
        source={{ uri: product.imageUrl }}
        className="h-28 w-full object-contain rounded"
      />
      <Text className="text-sm font-semibold mt-2">{product.name}</Text>
      <Text className="text-xs text-gray-600 mt-1">{product.price} Lei</Text>
      <TouchableOpacity
        className="bg-green-600 mt-2 py-1 rounded"
        onPress={onAddToCart}
      >
        <Text className="text-center text-white font-semibold text-sm">
          Adaugă
        </Text>
      </TouchableOpacity>
    </View>
  );
}
