import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: "#28a745", // verde pentru tab activ
        tabBarInactiveTintColor: "#555555", // gri închis pentru tab inactiv
        tabBarStyle: { backgroundColor: "#ffffff" }, // fundal alb la tab-bar
        headerShown: false, // folosim header personalizat în ecrane (dacă e nevoie)
      }}
    >
      <Tabs.Screen
        name="index" // corespunde la app/(tabs)/index.tsx
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products" // corespunde la app/(tabs)/shop.tsx
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="benefits" // corespunde la app/(tabs)/myBenefits.tsxr
        options={{
          title: "My Benefits",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="gift-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders" // corespunde la app/(tabs)/orders.tsx
        options={{
          title: "Orders",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="reader-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile" // corespunde la app/(tabs)/profile.tsx
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
