import { ProductResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface StoreProductStockDto {
  id: number;
  storeId: number;
  productId: number;
  quantity: number;
}

export default function AdminStoreStockScreen() {
  const router = useRouter();

  // ATENTIE la param → tu în URL ai /admin/stores/[storeId]
  const { storeId } = useLocalSearchParams<{ storeId?: string }>();
  const storeIdNumber = storeId ? Number(storeId) : undefined;

  const [store, setStore] = useState<{ name: string } | null>(null);
  const [storeStock, setStoreStock] = useState<StoreProductStockDto[]>([]);
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number>(0);
  const [quantity, setQuantity] = useState<string>("");

  // Fetch store info
  const fetchStore = async () => {
    if (storeIdNumber === undefined) return;
    try {
      const response = await apiClient.get(`/stores/${storeIdNumber}`);
      setStore(response.data);
    } catch (err) {
      console.error("Eroare la fetch store:", err);
    }
  };

  // Fetch stock
  const fetchStock = async () => {
    if (storeIdNumber === undefined) return;
    try {
      const response = await apiClient.get<StoreProductStockDto[]>(
        `/stores/${storeIdNumber}/stock`
      );
      setStoreStock(response.data);
    } catch (err) {
      console.error("Eroare la fetch stock:", err);
    }
  };

  // Fetch produse
  const fetchProducts = async () => {
    try {
      const response = await apiClient.get<ProductResponse[]>("/products");
      setAllProducts(response.data);
    } catch (err) {
      console.error("Eroare la fetch all products:", err);
    }
  };

  // Add stock
  const handleAddStock = async () => {
    if (!selectedProductId || selectedProductId === 0 || !quantity) {
      Alert.alert("Eroare", "Selectează un produs și introdu cantitatea.");
      return;
    }

    if (storeIdNumber === undefined) {
      console.error("Store ID undefined!");
      return;
    }

    try {
      await apiClient.post(`/stores/${storeIdNumber}/stock`, {
        productId: selectedProductId,
        quantity: parseInt(quantity),
      });

      setSelectedProductId(0);
      setQuantity("");
      fetchStock();
    } catch (err) {
      console.error("Eroare la adăugare stock:", err);
    }
  };

  // Utility pt a obține numele produsului din ID
  const getProductName = (productId: number) => {
    const product = allProducts.find((p) => p.id === productId);
    return product ? product.name : `Produs ID: ${productId}`;
  };

  useEffect(() => {
    if (storeIdNumber !== undefined) {
      fetchStore();
      fetchStock();
      fetchProducts();
    }
    console.log("Store ID:", storeIdNumber);
  }, [storeIdNumber]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-green-600 text-base">← Back</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-4">Admin Panel</Text>
        <Text className="text-xl font-bold mb-2">
          Magazin: {store?.name || "-"}
        </Text>

        {/* Lista stock */}
        <Text className="text-lg font-semibold mb-2">Stoc produse</Text>
        <FlatList
          data={storeStock}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View className="border-b border-gray-200 py-3">
              <Text className="text-black">
                {getProductName(item.productId)} | Cantitate: {item.quantity}
              </Text>
            </View>
          )}
          scrollEnabled={false} // important pt ScrollView nesting
        />

        {/* Adaugă stoc */}
        <Text className="text-lg font-semibold mb-2 mt-6">
          Adaugă stoc produs nou
        </Text>

        {/* Dropdown produs */}
        <Picker
          selectedValue={selectedProductId}
          onValueChange={(itemValue) => setSelectedProductId(itemValue)}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            marginBottom: 8,
            padding: 8,
          }}
        >
          <Picker.Item label="Selectează produs" value={0} />
          {allProducts.map((product) => (
            <Picker.Item
              key={product.id}
              label={product.name}
              value={product.id}
            />
          ))}
        </Picker>

        {/* Cantitate */}
        <TextInput
          placeholder="Cantitate"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />

        <TouchableOpacity
          onPress={handleAddStock}
          className="bg-green-600 rounded-lg py-3 px-6 mb-6"
        >
          <Text className="text-white text-center text-lg font-semibold">
            Adaugă stoc
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
