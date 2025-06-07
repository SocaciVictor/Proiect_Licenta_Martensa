import { StoreResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function AdminStoresScreen() {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const router = useRouter();

  const fetchStores = async () => {
    try {
      const response = await apiClient.get<StoreResponse[]>("/stores");
      setStores(response.data);
    } catch (err) {
      console.error("Eroare la fetch stores:", err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Magazine</Text>
      <FlatList
        data={stores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/admin/stores/${item.id}`)}
            className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50"
          >
            <Text className="font-semibold text-lg">{item.name}</Text>
            <Text className="text-gray-600">{item.location}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
