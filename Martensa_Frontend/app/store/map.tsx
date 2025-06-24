import { useCartStore } from "@/modules/cart/store/useCartStore";
import { useStoreStore } from "@/modules/stores/hooks/useStoreAvailability";
import { useSelectedStore } from "@/modules/stores/store/useSelectedStore";
import apiClient from "@/services/apiClient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function StoreMapScreen() {
  const { stores, fetchStores, loading } = useStoreStore();
  const { selectedStoreId, selectedStoreName, setSelectedStore } =
    useSelectedStore();
  const products = useCartStore((s) => s.products);
  const insets = useSafeAreaInsets();

  const [cartProductIds, setCartProductIds] = useState<number[]>([]);
  const [missingProductsMessage, setMissingProductsMessage] = useState<
    string | null
  >(null);

  // ✅ Actualizăm lista de ID-uri din coș
  useEffect(() => {
    setCartProductIds(products.map((p) => p.id));
  }, [products]);

  // 🔁 Fetch locații magazine
  useEffect(() => {
    fetchStores();
  }, []);

  const firstValidStore = stores.find((store) => {
    if (!store.location) return false;
    const coords = store.location.split(",").map(Number);
    return !isNaN(coords[0]) && !isNaN(coords[1]);
  });

  const defaultLatitude = firstValidStore
    ? Number(firstValidStore.location.split(",")[0])
    : 45.9432;
  const defaultLongitude = firstValidStore
    ? Number(firstValidStore.location.split(",")[1])
    : 24.9668;

  const handleContinueToPayment = async () => {
    if (!selectedStoreId) {
      setMissingProductsMessage("Selectează magazinul dorit.");
      return;
    }

    try {
      const response = await apiClient.post<number[]>(
        `/stores/${selectedStoreId}/stock/check`,
        { productIds: cartProductIds }
      );

      const missingProductIds = response.data;

      if (missingProductIds.length > 0) {
        const missingProductNames = products
          .filter((p) => missingProductIds.includes(p.id))
          .map((p) => p.name);

        const message = `Unele produse sunt indisponibile ${missingProductNames.join(
          ", "
        )}`;
        setMissingProductsMessage(message);
        return;
      }

      // 🔁 Curățăm mesajul dacă toate sunt disponibile
      setMissingProductsMessage(null);
      router.push("/payment/payment");
    } catch (error) {
      console.error("Eroare la verificarea stocului:", error);
      setMissingProductsMessage("A apărut o eroare. Încearcă din nou.");
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: defaultLatitude,
          longitude: defaultLongitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {stores.map((store) => {
          if (!store.location) return null;
          const [lat, lng] = store.location.split(",").map(Number);
          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
              key={store.id}
              coordinate={{ latitude: lat, longitude: lng }}
              title={store.name}
              description={store.availableServices || ""}
              pinColor={store.id === selectedStoreId ? "green" : undefined}
              onPress={() => setSelectedStore(store.id, store.name)}
            />
          );
        })}
      </MapView>

      {/* 🔙 Buton Back */}
      <TouchableOpacity
        className="absolute left-4 bg-white/90 rounded-full p-2 z-50 shadow-md"
        style={{ top: insets.top + 10 }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>

      {/* 🧱 Secțiune dedesubt pentru erori și buton */}
      <View className="absolute bottom-5 left-4 right-4 px-4">
        {missingProductsMessage && (
          <View className="bg-red-100 border border-red-400 p-3 rounded-lg mb-3">
            <Text className="text-red-700 font-semibold">
              {missingProductsMessage}
            </Text>
          </View>
        )}

        <View className="bg-white rounded-xl py-3 px-4 shadow-lg">
          <TouchableOpacity
            className="bg-green-600 py-3 rounded-lg"
            onPress={handleContinueToPayment}
          >
            <Text className="text-white text-center font-bold text-base">
              Continuă spre plată
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
