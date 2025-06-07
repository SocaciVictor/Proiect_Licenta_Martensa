import { Payment } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function AdminPaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchPayments = async () => {
    try {
      // Fetch pt toti userii → modifici endpointul la tine dacă e nevoie
      const response = await apiClient.get<Payment[]>("/payments/user/1"); // ex userId=1 (înlocuiești cu ceva generic)
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
            <Text className="font-semibold">Plată #{item.id}</Text>
            <Text className="text-gray-600">Utilizator: {item.userId}</Text>
            <Text className="text-gray-600">Comandă: {item.orderId}</Text>
            <Text className="text-gray-600">Suma: {item.amount} Lei</Text>
            <Text className="text-gray-600">Status: {item.paymentStatus}</Text>
          </View>
        )}
      />
    </View>
  );
}
