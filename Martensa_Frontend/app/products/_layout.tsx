// app/products/_layout.tsx
import { useCartStore } from "@/modules/cart/store/useCartStore";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";

export default function ProductsLayout() {
  const fetchCart = useCartStore((state) => state.fetchCart);
  useEffect(() => {
    fetchCart();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
