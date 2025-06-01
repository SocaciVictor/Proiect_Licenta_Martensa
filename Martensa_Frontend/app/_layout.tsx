import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "../globals.css";
import { AuthProvider } from "./context/AuthContext"; // păstrezi pentru layout fallback

export default function RootLayout() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <AuthProvider>
      {/* dacă încă îl folosești pentru fallback */}
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
    </AuthProvider>
  );
}
