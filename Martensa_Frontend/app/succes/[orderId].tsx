import { useCartStore } from "@/modules/cart/store/useCartStore";
import apiClient from "@/services/apiClient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SuccessScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  const [attempt, setAttempt] = useState(0); // nr de încercări
  const MAX_ATTEMPTS = 5; // maxim 10 încercări (~15-20 sec)
  const POLLING_INTERVAL = 2000; // 2 secunde între încercări

  useEffect(() => {
    let pollingInterval: any;

    const pollOrderStatus = async () => {
      try {
        console.log(`🕵️ Polling attempt ${attempt + 1} for orderId=${orderId}`);
        const res = await apiClient.get(`/orders/${orderId}/status`);

        console.log("➡️ Order status:", res.data);

        if (res.data === "COMPLETED") {
          console.log("✅ Comanda COMPLETED");
          clearCart();
          alert("✅ Plata reușită! Comanda este COMPLETĂ.");
          router.replace("/"); // redirect home
        } else if (attempt >= MAX_ATTEMPTS - 1) {
          console.log(
            "⚠️ Timeout: comanda nu a devenit COMPLETED în timp util."
          );
          alert(
            "⚠️ Plata nu a fost confirmată încă. Verifică istoricul comenzilor mai târziu."
          );
          router.replace("/(tabs)/orders");
        } else {
          setAttempt((prev) => prev + 1);
        }
      } catch (err) {
        console.error("Eroare la confirmarea comenzii:", err);
        if (attempt >= MAX_ATTEMPTS - 1) {
          alert(
            "❌ Eroare la confirmarea plății. Te rugăm să încerci din nou."
          );
          router.replace("/(tabs)/orders");
        } else {
          setAttempt((prev) => prev + 1);
        }
      }
    };

    if (orderId) {
      pollingInterval = setInterval(pollOrderStatus, POLLING_INTERVAL);
    }

    return () => clearInterval(pollingInterval); // cleanup când se închide ecranul
  }, [orderId, attempt]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#28a745" />
      <Text className="mt-4 text-lg">Așteptăm confirmarea plății...</Text>
      <Text className="mt-2 text-sm text-gray-500">
        Nu închide aplicația. Se verifică starea comenzii.
      </Text>
    </View>
  );
}
