import { ProductDetailsResponse } from "@/modules/auth/types/auth";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import apiClient from "@/services/apiClient";
import { showToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await apiClient.get<ProductDetailsResponse>(
          `/products/${id}`
        );
        setProduct(res.data);
      } catch (err) {
        console.error("Eroare la fetch produs:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
          <Text className="text-lg font-semibold text-black flex-1">
            {product.name}
          </Text>
          <TouchableOpacity onPress={() => router.push("/cart")}>
            <Ionicons name="cart-outline" size={25} color="#28a745" />
          </TouchableOpacity>
        </View>

        {/* Imagine */}
        <View className="items-center mt-4">
          <Image
            source={{ uri: product.imageUrl }}
            style={{ width: 220, height: 220, resizeMode: "contain" }}
          />
        </View>

        {/* Informații */}
        <View className="px-4 py-4 space-y-3">
          <Text className="text-xl font-semibold text-black">
            {product.name}
          </Text>

          <Text className="text-lg text-[#28a745] font-bold">
            {(product.discountPrice || product.price).toFixed(2)} Lei
          </Text>

          {product.price !== product.discountPrice && (
            <Text className="text-sm text-gray-600">
              Preț întreg: {product.price.toFixed(2)} Lei
            </Text>
          )}

          {product.description && (
            <Text className="text-base text-black mt-2">
              {product.description}
            </Text>
          )}

          {product.ingredients && (
            <Text className="text-sm text-gray-700 mt-1">
              <Text className="font-semibold">Ingrediente: </Text>
              {product.ingredients}
            </Text>
          )}

          {product.nutritionalValues && (
            <Text className="text-sm text-gray-700 mt-1">
              <Text className="font-semibold">Valori nutriționale: </Text>
              {product.nutritionalValues}
            </Text>
          )}

          {product.alcoholPercentage > 0 && (
            <Text className="text-sm text-gray-700 mt-1">
              <Text className="font-semibold">Alcool: </Text>
              {product.alcoholPercentage}%
            </Text>
          )}

          {product.disclaimer && (
            <Text className="text-sm text-red-500 mt-2 italic">
              {product.disclaimer}
            </Text>
          )}

          {/* Extra detalii */}
          <View className="border-t border-gray-200 pt-3 mt-3">
            <Text className="text-sm text-gray-500">
              Cod de bare: {product.barcode}
            </Text>
            <Text className="text-sm text-gray-500">
              Brand: {product.brand}
            </Text>
            <Text className="text-sm text-gray-500">
              Categorie: {product.categoryName}
            </Text>
            <Text className="text-sm text-gray-500">
              ID produs: {product.id}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Buton Adaugă în coș */}
      <View className="absolute bottom-0 right-0 left-0 bg-white px-4 py-3 border-t border-gray-200">
        <TouchableOpacity
          className="bg-green-600 py-3 rounded-lg"
          onPress={() => {
            useCartStore.getState().addProduct(product.id);
            showToast("Produs adăugat în coș");
          }}
        >
          <Text className="text-white text-center font-semibold text-base">
            Adaugă în coș
          </Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </View>
  );
}
