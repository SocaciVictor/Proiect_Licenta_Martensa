import { PaymentResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function AdminPaymentsScreen() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);

  const fetchPayments = async () => {
    try {
      const response = await apiClient.get<PaymentResponse[]>("/payments/all");
      setPayments(response.data);
    } catch (err) {
      console.error("Eroare la fetch payments:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Plăți</Text>
      <FlatList
        data={payments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-3">
            <Text className="font-semibold mb-1">Plată #{item.id}</Text>
            <Text className="text-gray-600 mb-1">
              Utilizator: {item.userSummaryResponse.firstName}{" "}
              {item.userSummaryResponse.lastName} (
              {item.userSummaryResponse.email})
            </Text>
            <Text className="text-gray-600 mb-1">Comandă: {item.orderId}</Text>
            <Text className="text-gray-600 mb-1">Suma: {item.amount} Lei</Text>
            <Text className="text-gray-600 mb-1">Status: {item.status}</Text>
            <Text className="text-gray-600 mb-1">Metodă: {item.method}</Text>
            <Text className="text-gray-600">
              Dată plată: {item.paymentDate.toString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
