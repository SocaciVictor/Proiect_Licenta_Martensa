import ProductCardAdvanced from "@/modules/products/components/ProductCartAdvanced";
import { useProductsByCategory } from "@/modules/products/hooks/useProductsByCategory";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProductsByCategoryScreen() {
  const { categoryId, name } = useLocalSearchParams();
  const router = useRouter();
  const { products, loading } = useProductsByCategory(categoryId);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-semibold text-black">{name}</Text>
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Ionicons name="cart-outline" size={25} color="#28a745" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center bg-gray-100 mx-4 mt-4 rounded-full px-4 py-2">
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          className="ml-2 flex-1 text-gray-600"
          placeholder="Caută produse"
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        className="mt-4"
        contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
        columnWrapperStyle={{ gap: 12 }}
        renderItem={({ item }) => <ProductCardAdvanced product={item} />}
        ListEmptyComponent={
          loading ? (
            <Text className="text-center mt-6 text-gray-400">
              Se încarcă...
            </Text>
          ) : (
            <Text className="text-center mt-6 text-gray-400">
              Nu există produse.
            </Text>
          )
        }
      />
    </View>
  );
}
