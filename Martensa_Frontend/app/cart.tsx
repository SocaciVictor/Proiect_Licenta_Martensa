import { useCartStore } from "@/modules/cart/store/useCartStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import CartProductCard from "../modules/cart/components/CartProductCard";

export default function CartScreen() {
  const {
    products,
    quantities,
    total,
    addProduct,
    removeProduct,
    clearCart,
    fetchCart,
  } = useCartStore();

  useEffect(() => {
    fetchCart(); // sincronizare automată când se deschide coșul
  }, []);

  const handleClearCart = () => {
    Alert.alert("Confirmare", "Golești coșul?", [
      { text: "Anulează", style: "cancel" },
      {
        text: "Da",
        onPress: clearCart,
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-semibold">
          Coș ({Object.values(quantities).reduce((a, b) => a + b, 0)})
        </Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Ionicons name="trash-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <CartProductCard
            product={item}
            quantity={quantities[item.id] || 0}
            onIncrement={() => addProduct(item.id)}
            onDecrement={() => removeProduct(item.id)}
          />
        )}
        ListEmptyComponent={
          <Text className="text-center mt-8 text-gray-500">
            Coșul este gol.
          </Text>
        }
      />

      {total > 0 && (
        <View className="border-t border-gray-200 px-4 py-4">
          <View className="flex-row justify-between mb-3">
            <Text className="text-lg font-semibold">TOTAL</Text>
            <Text className="text-lg font-semibold">
              {total.toFixed(2)} Lei
            </Text>
          </View>
          <TouchableOpacity
            className="bg-primary rounded py-3"
            onPress={() => router.push("/store/map")}
          >
            <Text className="text-white text-center font-bold text-base">
              Selectează magazinu
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast />
    </SafeAreaView>
  );
}
