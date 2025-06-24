import {
  ProductDetailsResponse,
  ProductResponse,
} from "@/modules/auth/types/auth";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import apiClientNoAuth from "@/services/apiClientNoAuth";
import { showToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  product: ProductResponse;
  onPress?: () => void;
};

export default function ProductPromoCard({ product, onPress }: Props) {
  const [details, setDetails] = useState<ProductDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const addProductToCart = useCartStore((state) => state.addProduct);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await apiClientNoAuth.get<ProductDetailsResponse>(
          `/products/${product.id}`
        );
        setDetails(res.data);
      } catch (err) {
        console.error("Eroare la fetch product details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [product.id]);

  if (loading || !details) {
    return (
      <View className="w-[48%] h-64 bg-white rounded-lg border border-gray-200 p-2 items-center justify-center my-2">
        <ActivityIndicator size="small" color="#28a745" />
      </View>
    );
  }

  const hasDiscount =
    details.discountPrice !== null && details.discountPrice < details.price;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="w-[48%] bg-white rounded-lg border border-gray-200 p-2 relative my-2"
    >
      {/* 🔴 Badge reducere peste imagine */}
      {hasDiscount && (
        <View className="absolute top-2 left-2 bg-red-600 px-2 py-1 rounded z-10">
          <Text className="text-xs text-white font-bold">Reducere</Text>
        </View>
      )}

      {/* Imagine produs */}
      <Image
        source={{ uri: details.imageUrl }}
        className="w-full h-28 rounded"
        resizeMode="contain"
      />

      {/* Nume produs */}
      <Text className="text-sm font-semibold mt-2 text-black" numberOfLines={2}>
        {details.name}
      </Text>

      {/* Prețuri */}
      <View className="mt-1">
        {hasDiscount && details.discountPrice ? (
          <>
            <Text className="text-sm text-gray-500 line-through">
              {details.price.toFixed(2)} Lei
            </Text>
            <Text className="text-lg font-extrabold text-[#28a745]">
              {details.discountPrice.toFixed(2)} Lei
            </Text>
          </>
        ) : (
          <Text className="text-lg font-bold text-black">
            {details.price.toFixed(2)} Lei
          </Text>
        )}
      </View>

      {/* Buton adaugă */}
      <TouchableOpacity
        className="mt-2 py-2 bg-[#28a745] rounded flex-row items-center justify-center"
        onPress={(e) => {
          e.stopPropagation();
          addProductToCart(details.id);
          showToast("Produs adăugat în coș");
        }}
      >
        <Ionicons name="cart-outline" size={18} color="white" />
        <Text className="text-white font-semibold ml-2">Adaugă</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
