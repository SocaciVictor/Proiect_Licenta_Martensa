// modules/auth/components/RegisterForm.tsx
import { useAuth } from "@/app/context/AuthContext";
import { RegisterRequest } from "@/modules/auth/types/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ScrollView, Text, TextInput, TouchableOpacity } from "react-native";
import { registerSchema } from "../validation/authSchema";

export default function RegisterForm() {
  const { onRegister } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterRequest) => {
    const result = await onRegister?.({ ...data, roles: ["ROLE_CUSTOMER"] });
    if (result?.token) {
      router.replace("/"); // Redirect după înregistrare
    } else {
      setError(result?.msg || "Eroare la înregistrare.");
    }
  };

  return (
    <ScrollView
      className="px-6 py-8"
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text className="text-2xl font-bold text-center mb-4">Înregistrare</Text>

      {error && <Text className="text-red-600">{error}</Text>}

      <TextInput
        placeholder="Email"
        onChangeText={(t) => setValue("email", t)}
        className="border border-gray-300 rounded p-3"
      />
      {errors.email && (
        <Text className="text-red-500">{errors.email.message}</Text>
      )}

      <TextInput
        placeholder="Parolă"
        secureTextEntry
        onChangeText={(t) => setValue("password", t)}
        className="border border-gray-300 rounded p-3"
      />
      {errors.password && (
        <Text className="text-red-500">{errors.password.message}</Text>
      )}

      <TextInput
        placeholder="Prenume"
        onChangeText={(t) => setValue("firstName", t)}
        className="border border-gray-300 rounded p-3"
      />
      <TextInput
        placeholder="Nume"
        onChangeText={(t) => setValue("lastName", t)}
        className="border border-gray-300 rounded p-3"
      />
      <TextInput
        placeholder="Adresă"
        onChangeText={(t) => setValue("address", t)}
        className="border border-gray-300 rounded p-3"
      />
      <TextInput
        placeholder="Telefon"
        onChangeText={(t) => setValue("phoneNumber", t)}
        className="border border-gray-300 rounded p-3"
      />
      <TextInput
        placeholder="Data nașterii (yyyy-mm-dd)"
        onChangeText={(t) => setValue("dateOfBirth", t)}
        className="border border-gray-300 rounded p-3"
      />
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-green-600 p-3 rounded mt-4"
      >
        <Text className="text-white text-center">Înregistrează-te</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
