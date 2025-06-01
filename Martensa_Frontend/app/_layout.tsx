import { Stack } from "expo-router";
import "../globals.css"; // importăm stilurile globale
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Stack Navigator pentru gestionarea navigării între ecrane */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Tab Navigator principal */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Ecranul de login definit în folderul auth (nu apare în tab-bar) */}
        <Stack.Screen
          name="auth/login"
          options={{ presentation: "modal", headerTitle: "Log in" }}
        />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
