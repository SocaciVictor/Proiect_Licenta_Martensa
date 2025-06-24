import {
  ProductDetailsResponse,
  ProductRequest,
} from "@/modules/auth/types/auth";
import { useCategories } from "@/modules/products/hooks/useCategories";
import apiClient from "@/services/apiClient";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { categories, loading: categoriesLoading } = useCategories();

  // 🧠 Folosim string-uri pentru a permite ".", inclusiv pe iPhone
  const [form, setForm] = useState<Record<keyof ProductRequest, string>>({
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
    categoryId: "Categorie",
  };

  const handleChange = (field: keyof ProductRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchProduct = async () => {
    try {
      const { data } = await apiClient.get<ProductDetailsResponse>(
        `/products/${id}`
      );

      const cat = categories.find((c) => c.name === data.categoryName);

      setForm({
        name: data.name,
        description: data.description,
        brand: data.brand,
        price: data.price.toString(),
        discountPrice: data.discountPrice?.toString() ?? "0",
        imageUrl: data.imageUrl,
        barcode: data.barcode,
        ingredients: data.ingredients,
        nutritionalValues: data.nutritionalValues,
        disclaimer: data.disclaimer,
        alcoholPercentage: data.alcoholPercentage?.toString() ?? "0",
        categoryId: cat ? cat.id.toString() : "0",
      });
    } catch (err) {
      console.error("Eroare la fetch product:", err);
      Alert.alert("Eroare", "Nu s-a putut încărca produsul.");
    }
  };

  useEffect(() => {
    if (id && !categoriesLoading) fetchProduct();
  }, [id, categoriesLoading]);

  const handleSubmit = async () => {
    try {
      await apiClient.put(`/products/${id}`, {
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

      Alert.alert("Succes", "Produsul a fost actualizat.");
      router.replace("/admin/products");
    } catch (err) {
      console.error("Eroare la update product:", err);
      Alert.alert("Eroare", "Nu s-a putut actualiza produsul.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Editează produs</Text>

      {(
        [
          "name",
          "description",
          "brand",
          "price",
          // "discountPrice", ❌ îl ascundem din UI
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
              ? "default" // ✅ permite punct pe iPhone
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
        className="bg-blue-600 py-3 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Salvează</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
