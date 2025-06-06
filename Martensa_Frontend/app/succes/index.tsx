import { useCartStore } from "@/modules/cart/store/useCartStore";
import apiClient from "@/services/apiClient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SuccessScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    const confirmOrder = async () => {
      try {
        const res = await apiClient.get(`/orders/${orderId}`);

        if (res.data.orderStatus === "COMPLETED") {
          console.log("✅ Comanda COMPLETED");
          alert("✅ Plata reușită! Comanda este COMPLETĂ.");

          clearCart(); // golim coșul

          router.replace("/"); // redirect către home
        } else {
          console.log("⚠️ Comanda nu e COMPLETED:", res.data.orderStatus);
          alert("⚠️ Plata nereușită sau încă în procesare.");
        }
      } catch (err) {
        console.error("Eroare la confirmarea comenzii:", err);
      }
    };

    if (orderId) {
      confirmOrder();
    }
  }, [orderId]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#28a745" />
      <Text className="mt-4 text-lg">Confirmăm plata comenzii...</Text>
    </View>
  );
}
