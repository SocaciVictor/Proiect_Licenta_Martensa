import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function AdminLayout() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-bold text-black">Admin Panel</Text>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")}>
          <View className="flex-row items-center space-x-1">
            <Ionicons name="arrow-back-outline" size={20} color="#28a745" />
            <Text className="text-green-600 font-semibold">Back</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}
