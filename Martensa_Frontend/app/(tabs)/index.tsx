// app/(tabs)/index.tsx  - Ecran Home
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const userLoggedIn = false; // exemplu: verificare stare autentificare

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Buton Login afișat dacă utilizatorul nu e autentificat */}
        {!userLoggedIn && (
          <TouchableOpacity
            className="self-start mb-4"
            onPress={() => router.push("/auth/login")}
          >
            <Text className="text-primary font-semibold text-base">Log in</Text>
          </TouchableOpacity>
        )}

        {/* Câmp de căutare produse */}
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            className="ml-2 flex-1 text-gray-600"
            placeholder="Search products"
            placeholderTextColor="#999"
          />
          <Ionicons name="qr-code-outline" size={22} color="#888" />
        </View>

        {/* Banner promoțional / conectare (exemplu stil Mega Image) */}
        <View className="bg-red-100 rounded-lg p-4 mb-4">
          <Text className="text-xl font-bold text-dark mb-2">
            Get More with Connect
          </Text>
          <Text className="text-gray-800 mb-2">
            Get points to unlock a discount next month
          </Text>
          <Text className="text-gray-800">Get discounts on your purchases</Text>
        </View>

        {/* Exemplar de secțiune informativă (ex: Selectează intervalul de livrare) */}
        <View className="bg-gray-50 rounded-lg p-3 mb-4 flex-row items-center justify-between">
          <View className="flex-1 pr-2">
            <Text className="text-dark font-semibold">
              Select your timeslot
            </Text>
            <Text className="text-gray-600 text-sm">
              When do you want your products?
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </View>

        {/* ... alte secțiuni sau liste de produse pot continua aici ... */}
      </ScrollView>
    </SafeAreaView>
  );
}
