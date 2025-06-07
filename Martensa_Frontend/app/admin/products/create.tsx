import { ProductRequest } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function CreateProductScreen() {
  const router = useRouter();

  const [form, setForm] = useState<ProductRequest>({
    name: "",
    description: "",
    brand: "",
    price: 0,
    discountPrice: 0,
    imageUrl: "",
    barcode: "",
    ingredients: "",
    nutritionalValues: "",
    disclaimer: "",
    alcoholPercentage: 0,
    categoryId: 1, // fallback default
  });

  const handleChange = (field: keyof ProductRequest, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await apiClient.post("/products", {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice),
        alcoholPercentage: Number(form.alcoholPercentage),
        categoryId: Number(form.categoryId),
      });
      Alert.alert("Succes", "Produsul a fost adăugat.");
      router.replace("/admin/products");
    } catch (err) {
      console.error("Eroare la create product:", err);
      Alert.alert("Eroare", "Nu s-a putut adăuga produsul.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Adaugă produs</Text>

      {[
        "name",
        "description",
        "brand",
        "price",
        "discountPrice",
        "imageUrl",
        "barcode",
        "ingredients",
        "nutritionalValues",
        "disclaimer",
        "alcoholPercentage",
        "categoryId",
      ].map((field) => (
        <TextInput
          key={field}
          placeholder={field}
          value={form[field as keyof ProductRequest]?.toString() ?? ""}
          onChangeText={(text) =>
            handleChange(field as keyof ProductRequest, text)
          }
          className="border border-gray-300 rounded-md px-4 py-2 mb-3"
        />
      ))}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-green-600 py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Adaugă</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
