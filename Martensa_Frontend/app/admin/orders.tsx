import { OrderResponse, UserSummaryResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminOrdersScreen() {
  const router = useRouter();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [userMap, setUserMap] = useState<Map<number, UserSummaryResponse>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);

  /** fetch orders + users in paralel */
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, usersRes] = await Promise.all([
        apiClient.get<OrderResponse[]>("/orders", {
          headers: { roles: "ADMIN" }, // simulăm rol admin
        }),
        apiClient.get<UserSummaryResponse[]>("/users"),
      ]);

      setOrders(ordersRes.data);

      // construim map pentru lookup rapid
      const map = new Map<number, UserSummaryResponse>();
      usersRes.data.forEach((u) => map.set(u.id, u));
      setUserMap(map);
    } catch (error) {
      console.error("Eroare la fetch orders/users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Comenzi</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const user = userMap.get(item.userId);
          const userLabel = user
            ? `${user.firstName} ${user.lastName} (${user.email})`
            : `ID: ${item.userId}`;

          return (
            <TouchableOpacity
              className="border-b border-gray-200 py-3"
              onPress={() =>
                router.push({
                  pathname: "/orders/[orderId]",
                  params: { orderId: item.id },
                })
              }
            >
              <Text className="font-semibold text-black">
                Comandă #{item.id}
              </Text>
              <Text className="text-gray-600">Utilizator: {userLabel}</Text>
              <Text className="text-gray-600">
                Total: {item.totalAmount.toFixed(2)} Lei
              </Text>
              <Text className="text-gray-600">Status: {item.orderStatus}</Text>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text className="text-center mt-8 text-gray-500">
            Nu există comenzi.
          </Text>
        }
      />
    </View>
  );
}
