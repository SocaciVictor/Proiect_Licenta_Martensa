import { OrderResponse } from "@/modules/orders/types/orderTypes";
import { useProductStore } from "@/modules/products/store/useProductStore";
import apiClient from "@/services/apiClient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderDetailsScreen() {
  const { orderId } = useLocalSearchParams();
  const products = useProductStore((state) => state.products);
  const fetchAllProducts = useProductStore((state) => state.fetchAllProducts);
  const router = useRouter();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<OrderResponse>(`/orders/${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Eroare la fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      // 👉 dacă nu am produse, fac fetchAllProducts
      if (products.length === 0) {
        await fetchAllProducts();
      }

      if (orderId) {
        await fetchOrder();
      }
    };

    init();
  }, [orderId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  if (!order) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-4">
        <Text className="text-center text-gray-500">
          Comanda nu a fost găsită.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-4">
      {/* Back button */}
      <TouchableOpacity className="mb-4" onPress={() => router.back()}>
        <Ionicons name="arrow-back-outline" size={24} color="#28a745" />
      </TouchableOpacity>

      <Text className="text-xl font-bold text-black mb-2">
        Comandă #{order.id}
      </Text>

      <Text className="text-sm text-gray-700 mb-1">
        Data: {new Date(order.orderDate).toLocaleDateString()}
      </Text>

      <Text className="text-sm text-gray-700 mb-1">
        Total: {order.totalAmount.toFixed(2)} Lei
      </Text>

      <Text className="text-sm text-gray-700 mb-1">
        Status: {order.orderStatus}
      </Text>

      <Text className="text-sm text-gray-700 mb-1">
        Adresă livrare: {order.shippingAddress}
      </Text>

      <Text className="text-sm text-gray-700 mb-4">
        Metodă plată: {order.paymentMethod}
      </Text>

      <Text className="text-lg font-bold text-black mb-2">Produse:</Text>

      <FlatList
        data={order.items}
        keyExtractor={(item) => `${item.productId}`}
        renderItem={({ item }) => {
          // 👉 lookup product pentru imageUrl
          const product = products.find((p) => p.id === item.productId);
          const imageUrl =
            product?.imageUrl ?? "https://via.placeholder.com/100";

          return (
            <View className="flex-row items-center py-2 border-b border-gray-200">
              <Image
                source={{ uri: imageUrl }}
                className="w-12 h-12 rounded mr-3"
                resizeMode="contain"
              />
              <View className="flex-1">
                <Text className="text-base text-black mb-1">
                  {item.productName}
                </Text>
                <Text className="text-sm text-gray-700">
                  Cantitate: {item.quantity} x {item.price.toFixed(2)} Lei
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text className="text-center mt-8 text-gray-500">
            Niciun produs în această comandă.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
