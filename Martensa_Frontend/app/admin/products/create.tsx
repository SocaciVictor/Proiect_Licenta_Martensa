import { ProductRequest } from "@/modules/auth/types/auth";
import { useCategories } from "@/modules/products/hooks/useCategories";
import apiClient from "@/services/apiClient";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function CreateProductScreen() {
  const router = useRouter();
  const { categories, loading: categoriesLoading } = useCategories();

  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    discountPrice: "",
    imageUrl: "",
    barcode: "",
    ingredients: "",
    nutritionalValues: "",
    disclaimer: "",
    alcoholPercentage: "",
    categoryId: "0",
  });

  const placeholders: Record<keyof ProductRequest, string> = {
    name: "Denumirea produsului",
    description: "Descriere",
    brand: "Brand",
    price: "Preț (ex: 12.99)",
    discountPrice: "Discount (nu se afișează)",
    imageUrl: "URL imagine produs",
    barcode: "Cod de bare",
    ingredients: "Ingrediente",
    nutritionalValues: "Valori nutriționale",
    disclaimer: "Avertismente (opțional)",
    alcoholPercentage: "Alcool % (ex: 0.0)",
    categoryId: "Categorie (aleasă din listă)",
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await apiClient.post("/products", {
        ...form,
        price: parseFloat(form.price.replace(",", ".")) || 0,
        discountPrice:
          form.discountPrice.trim() === ""
            ? null
            : parseFloat(form.discountPrice.replace(",", ".")),
        alcoholPercentage:
          parseFloat(form.alcoholPercentage.replace(",", ".")) || 0,
        categoryId: parseInt(form.categoryId),
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

      {(
        [
          "name",
          "description",
          "brand",
          "price",
          "imageUrl",
          "barcode",
          "ingredients",
          "nutritionalValues",
          "disclaimer",
          "alcoholPercentage",
        ] as (keyof ProductRequest)[]
      ).map((field) => (
        <TextInput
          key={field}
          placeholder={placeholders[field]}
          keyboardType={
            ["price", "alcoholPercentage"].includes(field)
              ? "default" // ✅ tastatură completă cu punct pe iPhone
              : "default"
          }
          value={form[field]}
          onChangeText={(text) => handleChange(field, text)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-3"
        />
      ))}

      {/* Picker categorie */}
      <Text className="mb-1 font-medium">Categorie</Text>
      {categoriesLoading ? (
        <ActivityIndicator style={{ marginBottom: 16 }} />
      ) : (
        <Picker
          selectedValue={parseInt(form.categoryId)}
          onValueChange={(value) =>
            setForm((prev) => ({ ...prev, categoryId: value.toString() }))
          }
          style={{ marginBottom: 16 }}
        >
          <Picker.Item label="Selectează categoria" value={0} />
          {categories.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-green-600 py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Adaugă</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
