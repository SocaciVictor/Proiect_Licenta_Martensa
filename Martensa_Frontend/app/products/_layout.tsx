// app/products/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native";

export default function ProductsLayout() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
