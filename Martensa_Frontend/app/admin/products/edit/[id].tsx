import {
  ProductDetailsResponse,
  ProductRequest,
} from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams();
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
    categoryId: 1,
  });

  const fetchProduct = async () => {
    try {
      const response = await apiClient.get<ProductDetailsResponse>(
        `/products/${id}`
      );
      const p = response.data;
      setForm({
        name: p.name,
        description: p.description,
        brand: p.brand,
        price: Number(p.price),
        discountPrice: Number(p.discountPrice),
        imageUrl: p.imageUrl,
        barcode: p.barcode,
        ingredients: p.ingredients,
        nutritionalValues: p.nutritionalValues,
        disclaimer: p.disclaimer,
        alcoholPercentage: p.alcoholPercentage ?? 0,
        categoryId: 1, // tu completezi corect dacă vrei din p.categoryId dacă ai
      });
    } catch (err) {
      console.error("Eroare la fetch product:", err);
      Alert.alert("Eroare", "Nu s-a putut încărca produsul.");
    }
  };

  const handleChange = (field: keyof ProductRequest, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await apiClient.put(`/products/${id}`, {
        ...form,
        price: Number(form.price),
        discountPrice: Number(form.discountPrice),
        alcoholPercentage: Number(form.alcoholPercentage),
        categoryId: Number(form.categoryId),
      });
      Alert.alert("Succes", "Produsul a fost actualizat.");
      router.replace("/admin/products");
    } catch (err) {
      console.error("Eroare la update product:", err);
      Alert.alert("Eroare", "Nu s-a putut actualiza produsul.");
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Editează produs</Text>

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
        className="bg-blue-600 py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Salvează</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
