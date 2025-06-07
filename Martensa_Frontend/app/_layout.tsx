import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import * as Linking from "expo-linking"; // important!
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

      try {
        // Folosim URL API pt parsing robust
        const parsedUrl = new URL(url);
        const orderId = parsedUrl.searchParams.get("orderId");

        if (
          parsedUrl.protocol === "martensa:" &&
          parsedUrl.pathname === "/success"
        ) {
          console.log("✅ Payment success for orderId:", orderId);
          clearCart();
          router.replace("/orders"); // navighezi la pagina de succes
        } else if (
          parsedUrl.protocol === "martensa:" &&
          parsedUrl.pathname === "/cancel"
        ) {
          console.log("❌ Payment cancelled for orderId:", orderId);
          router.replace("/cart"); // navighezi la pagina de eșec
        }
      } catch (err) {
        console.error("❌ Error processing deep link:", err);
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
