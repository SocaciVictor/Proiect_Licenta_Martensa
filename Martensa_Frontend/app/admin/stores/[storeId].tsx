import { ProductResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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

  const { storeId } = useLocalSearchParams<{ storeId?: string }>();
  const storeIdNumber = storeId ? Number(storeId) : undefined;

  const [store, setStore] = useState<{ name: string } | null>(null);
  const [storeStock, setStoreStock] = useState<StoreProductStockDto[]>([]);
  const [allProducts, setAllProducts] = useState<ProductResponse[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);
  const [quantity, setQuantity] = useState<string>("");

  const [searchStockQuery, setSearchStockQuery] = useState<string>("");
  const [searchProductQuery, setSearchProductQuery] = useState<string>("");

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
    if (!selectedProduct || !quantity) {
      Alert.alert("Eroare", "Selectează un produs și introdu cantitatea.");
      return;
    }

    if (storeIdNumber === undefined) {
      console.error("Store ID undefined!");
      return;
    }

    try {
      await apiClient.post(`/stores/${storeIdNumber}/stock`, {
        productId: selectedProduct.id,
        quantity: parseInt(quantity),
      });

      setSelectedProduct(null);
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

  // Filtered stock pt search in stock
  const filteredStock = storeStock.filter((item) => {
    const productName = getProductName(item.productId).toLowerCase();
    return productName.includes(searchStockQuery.toLowerCase());
  });

  // Filtered products pt search la adăugare produs nou
  const filteredProducts = allProducts.filter((product) =>
    product.name.toLowerCase().includes(searchProductQuery.toLowerCase())
  );

  useEffect(() => {
    if (storeIdNumber !== undefined) {
      fetchStore();
      fetchStock();
      fetchProducts();
    }
  }, [storeIdNumber]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <FlatList
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* Header */}
            <TouchableOpacity
              onPress={() => router.back()}
              className="mb-4 mt-4 px-4"
            >
              <Text className="text-green-600 text-base">← Back</Text>
            </TouchableOpacity>

            <Text className="text-2xl font-bold mb-4 px-4">Admin Panel</Text>
            <Text className="text-xl font-bold mb-2 px-4">
              Magazin: {store?.name || "-"}
            </Text>

            {/* Search stock */}
            <TextInput
              placeholder="Caută produs în stoc..."
              value={searchStockQuery}
              onChangeText={setSearchStockQuery}
              className="border border-gray-300 rounded-md px-4 py-2 mb-4 mx-4"
            />

            <Text className="text-lg font-semibold mb-2 px-4">
              Stoc produse
            </Text>
          </>
        }
        data={filteredStock}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="border-b border-gray-200 py-3 px-4">
            <Text className="text-black font-semibold">
              {getProductName(item.productId)}
            </Text>
            <Text className="text-gray-600">Cantitate: {item.quantity}</Text>
          </View>
        )}
        ListFooterComponent={
          <>
            {/* Search produse */}
            <Text className="text-lg font-semibold mb-2 mt-6 px-4">
              Adaugă stoc produs nou
            </Text>

            <TextInput
              placeholder="Caută produs..."
              value={searchProductQuery}
              onChangeText={setSearchProductQuery}
              className="border border-gray-300 rounded-md px-4 py-2 mb-4 mx-4"
            />

            {filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                onPress={() => setSelectedProduct(product)}
                className="border border-gray-300 rounded-lg px-4 py-3 mb-3 bg-gray-50 mx-4"
              >
                <Text className="text-black font-semibold">{product.name}</Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {product.price} Lei
                </Text>
              </TouchableOpacity>
            ))}

            {/* Zona de adaugă cantitate */}
            {selectedProduct && (
              <View className="mt-8 px-4 mb-10">
                <View className="mb-6 p-4 border border-green-600 rounded-md bg-green-50">
                  <Text className="text-green-800 font-semibold mb-2">
                    Produs selectat: {selectedProduct.name}
                  </Text>

                  <TouchableOpacity
                    onPress={() => setSelectedProduct(null)}
                    className="bg-red-500 rounded px-3 py-1 self-start mb-4"
                  >
                    <Text className="text-white">Schimbă produsul</Text>
                  </TouchableOpacity>

                  <TextInput
                    placeholder="Cantitate"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    className="border border-gray-300 rounded-md px-4 py-2 mb-4"
                  />

                  <TouchableOpacity
                    onPress={handleAddStock}
                    className="bg-green-600 rounded-lg py-3 px-6"
                  >
                    <Text className="text-white text-center text-lg font-semibold">
                      Adaugă stoc
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </KeyboardAvoidingView>
  );
}
