// app/(tabs)/_layout.tsx
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, usePathname, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { authState } = useAuth();

  const isHome = pathname === "/";

  const titles: { [key: string]: string } = {
    "/products": "Shop",
    "/benefits": "Beneficii",
    "/orders": "Comenzi",
    "/profile": "Profil",
  };

  const currentTitle = titles[pathname] || "";

  const isAuthenticated = authState?.authenticated === true;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        {/* Left: dacă e logat și e Home, afișează "Cardul meu" + imagine */}
        {isAuthenticated && isHome ? (
          <View className="flex-row items-center space-x-2">
            <TouchableOpacity onPress={() => router.push("/(tabs)/benefits")}>
              <View className="flex-row items-center space-x-2">
                {/* Imagine logo card */}
                <Image
                  source={require("../../assets/images/card-icon.png")}
                  style={{ width: 30, height: 30, resizeMode: "contain" }}
                />
                <Text className="text-primary text-base font-semibold">
                  Cardul meu
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : !isHome ? (
          <Text className="text-lg font-semibold text-black">
            {currentTitle}
          </Text>
        ) : (
          <View className="w-20" /> // spațiu rezervat
        )}

        {/* Right: login sau iconițe */}
        <View className="flex-row items-center space-x-4">
          {!isAuthenticated && isHome ? (
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text className="text-primary font-semibold text-base">
                Login
              </Text>
            </TouchableOpacity>
          ) : isAuthenticated && isHome ? (
            <>
              <TouchableOpacity onPress={() => router.push("/cart")}>
                <Ionicons name="cart-outline" size={25} color="#28a745" />
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>

      {/* TABS (nicio schimbare aici) */}
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: "#28a745",
          tabBarInactiveTintColor: "#555",
          tabBarStyle: { backgroundColor: "#fff" },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: "Shop",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="benefits"
          options={{
            title: "My Benefits",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="gift-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="reader-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-circle-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
