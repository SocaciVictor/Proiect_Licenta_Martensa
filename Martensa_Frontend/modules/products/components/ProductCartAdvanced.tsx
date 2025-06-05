import { ProductResponse } from "@/modules/auth/types/auth";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import { showToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  product: ProductResponse;
  onPress?: () => void; // 👈 adaugă onPress
};

export default function ProductCardAdvanced({ product, onPress }: Props) {
  const { quantities, addProduct, removeProduct, fetchCart } = useCartStore();
  const quantity = quantities[product.id] || 0;

  useEffect(() => {
    fetchCart();
  }, []);

  const displayPrice = product.price.toFixed(2);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="w-[48%] bg-white rounded-lg border border-gray-200 p-2"
    >
      <Image
        source={{ uri: product.imageUrl }}
        className="w-full h-28 object-contain rounded"
        resizeMode="contain"
      />

      <Text className="text-sm font-semibold mt-2 text-black" numberOfLines={2}>
        {product.name}
      </Text>

      <Text className="text-lg font-bold text-black mt-1">
        {displayPrice} Lei
      </Text>

      {quantity > 0 ? (
        <View className="flex-row justify-between items-center mt-2">
          <TouchableOpacity
            className="w-9 h-9 border border-[#28a745] rounded-sm items-center justify-center"
            onPress={(e) => {
              e.stopPropagation();
              removeProduct(product.id);
            }}
          >
            <Ionicons name="remove" size={20} color="#28a745" />
          </TouchableOpacity>

          <Text className="text-base font-semibold">{quantity}</Text>

          <TouchableOpacity
            className="w-9 h-9 border border-[#28a745] rounded-sm items-center justify-center"
            onPress={(e) => {
              e.stopPropagation();
              addProduct(product.id);
              showToast("Produs adăugat în coș");
            }}
          >
            <Ionicons name="add" size={20} color="#28a745" />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          className="mt-2 py-2 bg-[#28a745] rounded flex-row items-center justify-center"
          onPress={(e) => {
            e.stopPropagation();
            addProduct(product.id);
            showToast("Produs adăugat în coș");
          }}
        >
          <Ionicons name="cart-outline" size={18} color="white" />
          <Text className="text-white font-semibold ml-2">Adaugă</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
