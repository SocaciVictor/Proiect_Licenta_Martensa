import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs, usePathname, useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function TabLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const authenticated = useAuthStore((state) => state.authenticated);

  const isHome = pathname === "/";
  const titles: { [key: string]: string } = {
    "/products": "Shop",
    "/benefits": "Beneficii",
    "/orders": "Comenzi",
    "/profile": "Profil",
  };
  const currentTitle = titles[pathname] || "";

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        {authenticated && isHome ? (
          <TouchableOpacity onPress={() => router.push("/(tabs)/benefits")}>
            <View className="flex-row items-center space-x-2">
              <Image
                source={require("../../assets/images/card-icon.png")}
                style={{ width: 30, height: 30, resizeMode: "contain" }}
              />
              <Text className="text-primary text-base font-semibold">
                Cardul meu
              </Text>
            </View>
          </TouchableOpacity>
        ) : !isHome ? (
          <Text className="text-lg font-semibold text-black">
            {currentTitle}
          </Text>
        ) : (
          <View className="w-20" />
        )}

        <View className="flex-row items-center space-x-4">
          {!authenticated && isHome ? (
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text className="text-primary font-semibold text-base">
                Login
              </Text>
            </TouchableOpacity>
          ) : authenticated && isHome ? (
            <TouchableOpacity onPress={() => router.push("/cart")}>
              <Ionicons name="cart-outline" size={25} color="#28a745" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* TABS */}
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
      <Toast />
    </SafeAreaView>
  );
}
