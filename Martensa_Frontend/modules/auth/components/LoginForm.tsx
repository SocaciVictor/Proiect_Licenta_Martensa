import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { login } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import { loginSchema } from "../validation/authSchema";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setApiError(null);
    setLoading(true);
    try {
      const authResponse = await login(data.email, data.password);
      // Save token and user in global auth store
      setAuth(authResponse.token, authResponse.user);
      // Navigate to products page after successful login
      router.replace("/products");
    } catch (error: any) {
      // Show error message (e.g., invalid credentials or network error)
      const message =
        error?.message ||
        "Autentificare eșuată. Vă rugăm să încercați din nou.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-4">
      <Text className="text-2xl font-bold text-center mb-6">Autentificare</Text>

      {/* Email field */}
      <View className="mb-4">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded px-4 py-2"
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.email.message}
          </Text>
        )}
      </View>

      {/* Password field */}
      <View className="mb-4">
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="border border-gray-300 rounded px-4 py-2"
              placeholder="Parolă"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && (
          <Text className="text-red-500 text-sm mt-1">
            {errors.password.message}
          </Text>
        )}
      </View>

      {/* API error message */}
      {apiError && (
        <Text className="text-red-500 text-center mb-4">{apiError}</Text>
      )}

      {/* Submit button */}
      <Pressable
        className={`bg-blue-600 rounded py-3 ${loading ? "opacity-50" : ""}`}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text className="text-white text-center font-semibold">
            Autentificare
          </Text>
        )}
      </Pressable>
    </View>
  );
};

export default LoginForm;
