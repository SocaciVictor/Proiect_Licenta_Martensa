import { useStoreStore } from "@/modules/stores/hooks/useStoreAvailability";
import { useSelectedStore } from "@/modules/stores/store/useSelectedStore";
import { showToast } from "@/utils/toast";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function StoreMapScreen() {
  const { stores, fetchStores, loading } = useStoreStore();
  const insets = useSafeAreaInsets();
  const { selectedStoreId, selectedStoreName, setSelectedStore } =
    useSelectedStore();

  useEffect(() => {
    fetchStores();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  // fallback center → prima locație validă
  const firstValidStore = stores.find((store) => {
    if (!store.location) return false;
    const coords = store.location.split(",").map(Number);
    return !isNaN(coords[0]) && !isNaN(coords[1]);
  });

  const defaultLatitude = firstValidStore
    ? Number(firstValidStore.location.split(",")[0])
    : 45.9432; // fallback România
  const defaultLongitude = firstValidStore
    ? Number(firstValidStore.location.split(",")[1])
    : 24.9668;

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
              onPress={() => {
                setSelectedStore(store.id, store.name);
              }}
            />
          );
        })}
      </MapView>

      {/* 🔙 Buton Back */}
      <TouchableOpacity
        className="absolute left-4 bg-white/90 rounded-full p-2 z-50 shadow-md"
        style={{
          top: insets.top + 10, // adaugăm padding peste safe area
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>

      {/* 🟢 Buton continuare plată */}
      <View className="absolute bottom-5 left-4 right-4 bg-white rounded-xl px-4 py-3 shadow-lg">
        <TouchableOpacity
          className="bg-green-600 py-3 rounded-lg"
          onPress={() => {
            if (!selectedStoreId) {
              showToast("Selectează magazinul dorit");
              return;
            }

            router.push("/payment/payment");
          }}
        >
          <Text className="text-white text-center font-bold text-base">
            Continuă spre plată
          </Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </SafeAreaView>
  );
}
