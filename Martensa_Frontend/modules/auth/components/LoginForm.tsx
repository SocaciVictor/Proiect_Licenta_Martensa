// modules/auth/components/LoginForm.tsx
import { useAuth } from "@/app/context/AuthContext";
import { LoginRequest } from "@/modules/auth/types/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { loginSchema } from "../validation/authSchema";

export default function LoginForm() {
  const { onLogin } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginRequest) => {
    const result = await onLogin?.(data);
    if (result?.token) {
      router.replace("/"); // Redirect după login
    } else {
      setError(result?.msg || "Eroare la autentificare.");
    }
  };

  return (
    <View className="space-y-4 px-6 py-8">
      <Text className="text-2xl font-bold text-center mb-4">Autentificare</Text>

      {error && <Text className="text-red-600">{error}</Text>}

      <TextInput
        placeholder="Email"
        onChangeText={(text) => setValue("email", text)}
        className="border border-gray-300 rounded p-3"
      />
      {errors.email && (
        <Text className="text-red-500">{errors.email.message}</Text>
      )}

      <TextInput
        placeholder="Parolă"
        secureTextEntry
        onChangeText={(text) => setValue("password", text)}
        className="border border-gray-300 rounded p-3"
      />
      {errors.password && (
        <Text className="text-red-500">{errors.password.message}</Text>
      )}

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-green-600 p-3 rounded"
      >
        <Text className="text-white text-center">Conectează-te</Text>
      </TouchableOpacity>
    </View>
  );
}
