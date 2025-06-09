import apiClient from "@/services/apiClient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function AdminAddStoreScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [managerName, setManagerName] = useState("");
  const [availableServices, setAvailableServices] = useState("");

  const handleAddStore = async () => {
    if (
      !name ||
      !location ||
      !openingHours ||
      !contactNumber ||
      !managerName ||
      !availableServices
    ) {
      Alert.alert("Eroare", "Completează toate câmpurile.");
      return;
    }

    try {
      await apiClient.post("/stores", {
        name,
        location,
        openingHours,
        contactNumber,
        managerName,
        availableServices,
      });

      Alert.alert("Succes", "Magazin adăugat cu succes!");
      router.replace("/admin/stores");
    } catch (err) {
      console.error("Eroare la adăugare store:", err);
      Alert.alert("Eroare", "A apărut o eroare la adăugarea magazinului.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text className="text-green-600 text-base">← Back</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-6">Adaugă magazin nou</Text>

        {/* Câmpuri formular */}
        <TextInput
          placeholder="Nume magazin"
          value={name}
          onChangeText={setName}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        <TextInput
          placeholder="Locație (ex: latitudine, longitudine)"
          value={location}
          onChangeText={setLocation}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        <TextInput
          placeholder="Program (ex: 7:00-22:00)"
          value={openingHours}
          onChangeText={setOpeningHours}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        <TextInput
          placeholder="Număr de contact"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        <TextInput
          placeholder="Nume manager"
          value={managerName}
          onChangeText={setManagerName}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />
        <TextInput
          placeholder="Servicii disponibile (ex: Delivery)"
          value={availableServices}
          onChangeText={setAvailableServices}
          className="border border-gray-300 rounded-md px-4 py-2 mb-4"
        />

        {/* Buton Adaugă */}
        <TouchableOpacity
          onPress={handleAddStore}
          className="bg-green-600 rounded-lg py-3 px-6 mb-6"
        >
          <Text className="text-white text-center text-lg font-semibold">
            ➕ Adaugă magazin
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
