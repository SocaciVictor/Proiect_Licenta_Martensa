import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const register = useAuthStore((state) => state.register);
  const router = useRouter();

  const handleRegister = async () => {
    const payload = {
      email,
      password,
      firstName,
      lastName,
      address,
      phoneNumber,
      dateOfBirth,
      roles: ["USER"],
    };

    const response = await register(payload);

    if (response?.error) {
      Alert.alert("Eroare", response.msg);
    } else {
      router.replace("/(tabs)/profile");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Prenume"
        className="border border-gray-300 rounded-md px-4 py-2 mb-3"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Nume"
        className="border border-gray-300 rounded-md px-4 py-2 mb-3"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        className="border border-gray-300 rounded-md px-4 py-2 mb-3"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Parolă"
        secureTextEntry
        className="border border-gray-300 rounded-md px-4 py-2 mb-3"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Adresă"
        className="border border-gray-300 rounded-md px-4 py-2 mb-3"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        placeholder="Număr de telefon"
        keyboardType="phone-pad"
        className="border border-gray-300 rounded-md px-4 py-2 mb-3"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        placeholder="Data nașterii (YYYY-MM-DD)"
        className="border border-gray-300 rounded-md px-4 py-2 mb-6"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />

      <TouchableOpacity
        onPress={handleRegister}
        className="bg-green-600 py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Register</Text>
      </TouchableOpacity>
    </View>
  );
}
