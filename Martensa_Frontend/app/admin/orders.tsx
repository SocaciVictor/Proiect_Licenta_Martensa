import { OrderResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function AdminOrdersScreen() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await apiClient.get<OrderResponse[]>("/orders", {
        headers: {
          roles: "ADMIN", // simulăm header-ul roles
        },
      });
      setOrders(response.data);
    } catch (err) {
      console.error("Eroare la fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Comenzi</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-3">
            <Text className="font-semibold">Comandă #{item.id}</Text>
            <Text className="text-gray-600">Utilizator: {item.userId}</Text>
            <Text className="text-gray-600">Total: {item.totalAmount} Lei</Text>
            <Text className="text-gray-600">Status: {item.orderStatus}</Text>
          </View>
        )}
      />
    </View>
  );
}
