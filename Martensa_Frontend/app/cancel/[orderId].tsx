import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function CancelScreen() {
  const { orderId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    console.log("❌ Payment cancelled for orderId:", orderId);

    const timer = setTimeout(() => {
      router.replace("/(tabs)/orders");
    }, 3000);

    return () => clearTimeout(timer);
  }, [orderId]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#E53935" />
      <Text className="mt-4 text-lg text-red-600">Plata a fost anulată.</Text>
      <Text className="mt-2 text-sm text-gray-500">
        Vei fi redirecționat către coșul de cumpărături...
      </Text>
    </View>
  );
}
