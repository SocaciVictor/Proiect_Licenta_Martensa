import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import * as Linking from "expo-linking"; // important!!
import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import "../globals.css";
import { AuthProvider } from "./context/AuthContext"; // păstrezi pentru layout fallback

export default function RootLayout() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const clearCart = useCartStore((state) => state.clearCart);

  // INIT auth + cart on app start
  useEffect(() => {
    const init = async () => {
      await initAuth();
      if (useAuthStore.getState().authenticated) {
        fetchCart();
      }
    };

    init();
  }, []);

  // Global deep link handler → Stripe success / cancel
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("🌐 Deep link received:", url);

      if (url.startsWith("martensa://success")) {
        const orderId = new URL(url).searchParams.get("orderId");
        console.log("✅ Payment success for orderId:", orderId);
        clearCart();
        router.replace("/orders"); // sau pagina ta de succes
      } else if (url.startsWith("martensa://cancel")) {
        const orderId = new URL(url).searchParams.get("orderId");
        console.log("❌ Payment cancelled for orderId:", orderId);
        router.replace("/cart"); // sau pagina de eșec
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/login"
          options={{ presentation: "modal", headerTitle: "Log in" }}
        />
        <Stack.Screen
          name="auth/register"
          options={{ presentation: "modal", headerTitle: "Register" }}
        />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </AuthProvider>
  );
}
