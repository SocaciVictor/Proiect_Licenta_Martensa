import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // Stack global care conține tab-urile și eventual ecrane externe (ex: auth)
    <Stack screenOptions={{ headerShown: false }}>
      {/* Tab Navigator principal */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Ecranul de login definit în folderul auth (nu apare în tab-bar) */}
      <Stack.Screen
        name="auth/login"
        options={{ presentation: "modal", headerTitle: "Log in" }}
      />
    </Stack>
  );
}
