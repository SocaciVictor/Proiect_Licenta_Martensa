// app/auth/login.tsx
import LoginForm from "@/modules/auth/components/LoginForm";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-2xl font-bold text-dark mb-6 text-center">
          Autentificare
        </Text>

        {/* Formularul logic */}
        <LoginForm />

        {/* Link către înregistrare */}
        <View className="mt-8 flex-row justify-center">
          <Text className="text-gray-600">Nu ai cont?</Text>
          <TouchableOpacity onPress={() => router.push("/auth/register")}>
            <Text className="text-green-600 font-semibold ml-1">
              Creează unul
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
