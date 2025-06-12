import { useRefreshStore } from "@/hooks/useRefreshStore"; // ⬅️ adăugat
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useOrderStore } from "@/modules/orders/store/useOrderStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function OrdersScreen() {
  const { orders, fetchOrdersByUserId, loading } = useOrderStore();
  const router = useRouter();
  const userId = useAuthStore((state) => state.userId);
  const refreshVersion = useRefreshStore((state) => state.refreshVersion);

  useEffect(() => {
    if (userId) {
      fetchOrdersByUserId(userId);
      console.log("Fetching orders for user ID:", userId);
    }
  }, [userId, refreshVersion]);

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <Text className="text-xl font-bold text-black mb-4">Comenzile mele</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white border border-[#28a745] rounded-lg p-4 mb-3 shadow-sm"
              onPress={() =>
                router.push({
                  pathname: "/orders/[orderId]",
                  params: { orderId: item.id },
                })
              }
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="font-bold text-black">#Comandă {item.id}</Text>
                <Text className="text-green-600 text-sm">
                  {item.orderStatus}
                </Text>
              </View>

              <Text className="text-sm text-gray-700 mb-1">
                Data: {new Date(item.orderDate).toLocaleDateString()}
              </Text>

              <Text className="text-sm text-gray-700 mb-1">
                Total: {item.totalAmount.toFixed(2)} Lei
              </Text>

              <Text className="text-xs text-gray-500 italic">
                Metodă plată: {item.paymentMethod}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-center mt-8 text-gray-500">
              Nu ai comenzi plasate încă.
            </Text>
          }
        />
      )}
    </View>
  );
}
