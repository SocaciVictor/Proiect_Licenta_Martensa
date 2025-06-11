import { useCartStore } from "@/modules/cart/store/useCartStore";
import { showToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  product: {
    id: number;
    name: string;
    price: number;
    discountPrice: number;
    imageUrl: string;
  };
};

export default function BenefitProductCard({ product }: Props) {
  const { quantities, addProduct, removeProduct } = useCartStore();
  const quantity = quantities[product.id] || 0;

  const displayPrice = product.price.toFixed(2);
  const displayDiscountPrice = product.discountPrice.toFixed(2);

  const hasDiscount = product.discountPrice < product.price;

  return (
    <View className="w-[48%] bg-white rounded-lg border border-gray-200 p-2 mb-3">
      <Image
        source={{ uri: product.imageUrl }}
        className="w-full h-28 object-contain rounded"
        resizeMode="contain"
      />

      <Text className="text-sm font-semibold mt-2 text-black" numberOfLines={2}>
        {product.name}
      </Text>

      <View className="flex-row items-baseline mt-1 space-x-2">
        {hasDiscount && (
          <Text className="text-lg font-bold text-[#28a745]">
            {displayDiscountPrice} Lei
          </Text>
        )}
        <Text
          className={`text-base ${
            hasDiscount ? "line-through text-gray-500" : "text-black font-bold"
          }`}
        >
          {displayPrice} Lei
        </Text>
      </View>

      {quantity > 0 ? (
        <View className="flex-row justify-between items-center mt-2">
          <TouchableOpacity
            className="w-9 h-9 border border-[#28a745] rounded-sm items-center justify-center"
            onPress={() => removeProduct(product.id)}
          >
            <Ionicons name="remove" size={20} color="#28a745" />
          </TouchableOpacity>

          <Text className="text-base font-semibold">{quantity}</Text>

          <TouchableOpacity
            className="w-9 h-9 border border-[#28a745] rounded-sm items-center justify-center"
            onPress={() => {
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
          onPress={() => {
            addProduct(product.id);
            showToast("Produs adăugat în coș");
          }}
        >
          <Ionicons name="cart-outline" size={18} color="white" />
          <Text className="text-white font-semibold ml-2">Adaugă</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
