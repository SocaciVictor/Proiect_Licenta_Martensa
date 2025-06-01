// modules/auth/components/LoginForm.tsx
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLogin = async () => {
    const response = await login({ email, password });

    if (response?.error) {
      Alert.alert("Eroare", response.msg);
    } else {
      router.replace("/(tabs)/profile");
    }
  };

  return (
    <View>
      <TextInput
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="border border-gray-300 rounded-md px-4 py-2 mb-6"
        placeholder="Parolă"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-green-600 py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
