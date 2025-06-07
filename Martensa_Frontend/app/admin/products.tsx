import { ProductResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AdminProductsScreen() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<ProductResponse[]>("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Eroare la fetch products:", err);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    Alert.alert("Confirmare", "Sigur vrei să ștergi acest produs?", [
      { text: "Anulează", style: "cancel" },
      {
        text: "Șterge",
        style: "destructive",
        onPress: async () => {
          try {
            await apiClient.delete(`/products/${productId}`);
            fetchProducts();
          } catch (err) {
            console.error("Eroare la delete product:", err);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Produse</Text>

      {/* Buton Add Product */}
      <TouchableOpacity
        onPress={() => router.push("/admin/products/create")}
        className="bg-green-600 py-3 rounded-lg mb-4"
      >
        <Text className="text-white text-center font-semibold text-lg">
          + Add Product
        </Text>
      </TouchableOpacity>

      {/* Listă produse */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center border-b border-gray-200 py-3">
            {/* Imagine */}
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 8,
                backgroundColor: "#f0f0f0",
              }}
              resizeMode="cover"
            />

            {/* Detalii produs */}
            <View className="flex-1 ml-4">
              <Text className="font-semibold">{item.name}</Text>
              <Text className="text-gray-600">{item.price} Lei</Text>
            </View>

            {/* Butoane Edit / Delete */}
            <View className="flex-row space-x-4 ml-4">
              <TouchableOpacity
                onPress={() => router.push(`/admin/products/edit/${item.id}`)}
                className="bg-blue-500 px-3 py-1 rounded mr-2"
              >
                <Text className="text-white">Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteProduct(item.id)}
                className="bg-red-500 px-3 py-1 rounded"
              >
                <Text className="text-white">Șterge</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}
