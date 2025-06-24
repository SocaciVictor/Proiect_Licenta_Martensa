import { ProductRequest } from "@/modules/auth/types/auth";
import { useCategories } from "@/modules/products/hooks/useCategories";
import apiClient from "@/services/apiClient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

  const [modalVisible, setModalVisible] = useState(false);

  const selectedCategory = categories.find(
    (c) => c.id.toString() === form.categoryId
  );

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
          "discountPrice",
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
            ["price", "discountPrice", "alcoholPercentage"].includes(field)
              ? "decimal-pad"
              : "default"
          }
          value={form[field]}
          onChangeText={(text) => handleChange(field, text)}
          className="border border-gray-300 rounded-md px-4 py-2 mb-3"
        />
      ))}

      <Text className="mb-1 font-medium">Categorie</Text>

      {categoriesLoading ? (
        <ActivityIndicator />
      ) : (
        <>
          <TouchableOpacity
            className="border border-gray-300 rounded-md px-4 py-2 mb-4"
            onPress={() => setModalVisible(true)}
          >
            <Text>
              {selectedCategory
                ? selectedCategory.name
                : "Selectează categoria"}
            </Text>
          </TouchableOpacity>

          {/* Modal select categorie */}
          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 justify-center bg-black/50">
              <View className="bg-white mx-6 rounded-lg p-4 max-h-[70%]">
                <Text className="text-lg font-bold mb-4">
                  Alege o categorie
                </Text>
                <FlatList
                  data={categories}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="py-2 border-b border-gray-200"
                      onPress={() => {
                        setForm((prev) => ({
                          ...prev,
                          categoryId: item.id.toString(),
                        }));
                        setModalVisible(false);
                      }}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Modal>
        </>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-green-600 py-3 rounded-lg mt-4"
      >
        <Text className="text-white text-center font-semibold">Adaugă</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
