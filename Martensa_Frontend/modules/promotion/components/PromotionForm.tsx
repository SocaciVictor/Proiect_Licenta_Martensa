import { PromotionType } from "@/modules/auth/types/auth";
import { useProductsAll } from "@/modules/products/hooks/useProductsAll";
import { createPromotion } from "@/modules/promotion/api/promotionApi";
import SearchBar from "@/modules/promotion/components/SearchBar";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

type Props = {
  onCreated: () => void;
};

export default function PromotionForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState<number>(10);
  const [startDate, setStartDate] = useState("2025-06-15");
  const [endDate, setEndDate] = useState("2025-06-30");
  const [promotionType, setPromotionType] = useState<PromotionType>(
    PromotionType.ALL
  );
  const [productIds, setProductIds] = useState<number[]>([]);
  const [userIds, setUserIds] = useState<number[]>([]);

  const { products } = useProductsAll();
  const [users, setUsers] = useState<any[]>([]);

  const [searchProduct, setSearchProduct] = useState("");
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await apiClient.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Eroare la fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const toggleProduct = (id: number) => {
    setProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleUser = (id: number) => {
    setUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      await createPromotion({
        title,
        description,
        discountPercentage,
        startDate,
        endDate,
        promotionType,
        productIds,
        userIds: promotionType === PromotionType.CUSTOM ? userIds : [],
      });
      Toast.show({
        type: "success",
        text1: "Promoția a fost creată cu succes",
      });

      setTitle("");
      setDescription("");
      setDiscountPercentage(10);
      setStartDate("2025-06-15");
      setEndDate("2025-06-30");
      setPromotionType(PromotionType.ALL);
      setProductIds([]);
      setUserIds([]);
      setSearchProduct("");
      setSearchUser("");
      onCreated();
    } catch (err) {
      console.error("Eroare la creare promoție:", err);
      Toast.show({
        type: "error",
        text1: "Eroare la creare promoție",
      });
    }
  };

  // Filtrare produse
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // Filtrare useri
  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchUser.toLowerCase())
  );

  return (
    <View className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
      <Text className="text-xl font-bold mb-3">Creează Promoție</Text>

      <Text className="text-sm font-semibold mb-1">Titlu</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        className="border border-gray-300 rounded px-2 py-1 mb-3"
      />

      <Text className="text-sm font-semibold mb-1">Descriere</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        className="border border-gray-300 rounded px-2 py-1 mb-3"
      />

      <Text className="text-sm font-semibold mb-1">Reducere (%)</Text>
      <TextInput
        value={discountPercentage.toString()}
        onChangeText={(text) => setDiscountPercentage(Number(text))}
        keyboardType="numeric"
        className="border border-gray-300 rounded px-2 py-1 mb-3"
      />

      <Text className="text-sm font-semibold mb-1">Dată început</Text>
      <TextInput
        value={startDate}
        onChangeText={setStartDate}
        placeholder="YYYY-MM-DD"
        className="border border-gray-300 rounded px-2 py-1 mb-3"
      />

      <Text className="text-sm font-semibold mb-1">Dată sfârșit</Text>
      <TextInput
        value={endDate}
        onChangeText={setEndDate}
        placeholder="YYYY-MM-DD"
        className="border border-gray-300 rounded px-2 py-1 mb-3"
      />

      <Text className="text-sm font-semibold mb-2">Tip promoție</Text>
      <View className="flex-row items-center mb-3">
        <TouchableOpacity
          onPress={() => setPromotionType(PromotionType.ALL)}
          className={`px-4 py-2 rounded mr-2 ${
            promotionType === PromotionType.ALL ? "bg-green-600" : "bg-gray-300"
          }`}
        >
          <Text
            className={`${
              promotionType === PromotionType.ALL ? "text-white" : "text-black"
            } font-semibold`}
          >
            ALL
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setPromotionType(PromotionType.CUSTOM)}
          className={`px-4 py-2 rounded ${
            promotionType === PromotionType.CUSTOM
              ? "bg-green-600"
              : "bg-gray-300"
          }`}
        >
          <Text
            className={`${
              promotionType === PromotionType.CUSTOM
                ? "text-white"
                : "text-black"
            } font-semibold`}
          >
            CUSTOM
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-sm font-semibold mb-2">Selectează produse</Text>
      <SearchBar
        value={searchProduct}
        onChange={setSearchProduct}
        placeholder="Caută produs..."
      />
      <View className="flex-wrap flex-row mb-4">
        {filteredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            onPress={() => toggleProduct(product.id)}
            className={`border rounded px-2 py-1 mr-2 mb-2 ${
              productIds.includes(product.id)
                ? "border-green-600"
                : "border-gray-300"
            }`}
          >
            <Text>{product.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {promotionType === PromotionType.CUSTOM && (
        <>
          <Text className="text-sm font-semibold mb-2">Selectează useri</Text>
          <SearchBar
            value={searchUser}
            onChange={setSearchUser}
            placeholder="Caută utilizator..."
          />
          <View className="flex-wrap flex-row mb-4">
            {filteredUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                onPress={() => toggleUser(user.id)}
                className={`border rounded px-2 py-1 mr-2 mb-2 ${
                  userIds.includes(user.id)
                    ? "border-green-600"
                    : "border-gray-300"
                }`}
              >
                <Text>
                  {user.firstName} {user.lastName}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-green-600 py-3 rounded"
      >
        <Text className="text-white text-center font-semibold">
          Creează promoția
        </Text>
      </TouchableOpacity>
    </View>
  );
}
