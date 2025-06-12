import { useRefreshStore } from "@/hooks/useRefreshStore"; // ⬅️ adăugat
import { useCartStore } from "@/modules/cart/store/useCartStore";
import ProductCardAdvanced from "@/modules/products/components/ProductCartAdvanced";
import SearchOverlay from "@/modules/products/components/SearchOverlay";
import { useProductsByCategory } from "@/modules/products/hooks/useProductsByCategory";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function ProductsByCategoryScreen() {
  const { categoryId, name } = useLocalSearchParams();
  const router = useRouter();
  const { products, loading } = useProductsByCategory(categoryId);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const refreshVersion = useRefreshStore((state) => state.refreshVersion); // ⬅️ adăugat

  useEffect(() => {
    fetchCart();
  }, [refreshVersion]); // ⬅️ adăugat refreshVersion

  return (
    <View className="flex-1 bg-white ">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-semibold text-black">{name}</Text>
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Ionicons name="cart-outline" size={25} color="#28a745" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 bg-white px-3 pt-2">
        <SearchOverlay />

        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          className="mt-4"
          contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
          columnWrapperStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <ProductCardAdvanced
              product={item}
              onPress={() =>
                router.push({
                  pathname: "/products/details/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
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

        <Toast />
      </View>
    </View>
  );
}
