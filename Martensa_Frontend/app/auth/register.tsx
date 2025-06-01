import RegisterForm from "@/modules/auth/components/RegisterForm";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
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
        <Text className="text-2xl font-bold mb-6 text-center">
          Înregistrare
        </Text>

        <RegisterForm />

        <View className="mt-8 flex-row justify-center">
          <Text className="text-gray-600">Ai deja cont?</Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text className="text-green-600 font-semibold ml-1">
              Autentifică-te
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
