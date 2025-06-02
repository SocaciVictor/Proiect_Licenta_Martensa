// app/cart.tsx
import { useCart } from "@/modules/cart/hooks/useCart";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CartScreen() {
  const {
    cart,
    total,
    products,
    quantities,
    addProduct,
    removeProduct,
    clearCart,
  } = useCart();

  const handleClearCart = () => {
    Alert.alert("Confirmare", "Golești coșul?", [
      { text: "Anulează", style: "cancel" },
      {
        text: "Da",
        onPress: () => clearCart(),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
        <Text className="text-lg font-semibold">
          Coș ({Object.values(quantities).reduce((a, b) => a + b, 0)})
        </Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Ionicons name="trash-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Lista produse */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => (
          <View className="mb-6 border-b border-gray-200 pb-4">
            <View className="flex-row items-center">
              <Image
                source={{ uri: item.imageUrl }}
                className="w-20 h-20 rounded mr-3"
                resizeMode="contain"
              />
              <View className="flex-1">
                <Text className="font-semibold">{item.name}</Text>
                <Text className="text-sm text-gray-500">
                  {(item.discountPrice || item.price).toFixed(2)} Lei
                </Text>
                <View className="flex-row items-center mt-2 space-x-2">
                  <TouchableOpacity
                    className="bg-red-500 rounded px-2"
                    onPress={() => removeProduct(item.id)}
                  >
                    <Text className="text-white font-bold text-lg">−</Text>
                  </TouchableOpacity>
                  <Text>{quantities[item.id]}</Text>
                  <TouchableOpacity
                    className="bg-green-600 rounded px-2"
                    onPress={() => addProduct(item.id)}
                  >
                    <Text className="text-white font-bold text-lg">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center mt-8 text-gray-500">
            Coșul este gol.
          </Text>
        }
      />

      {/* TOTAL */}
      {cart && (
        <View className="border-t border-gray-200 px-4 py-4">
          <View className="flex-row justify-between mb-3">
            <Text className="text-lg font-semibold">TOTAL</Text>
            <Text className="text-lg font-semibold">
              {total?.toFixed(2)} Lei
            </Text>
          </View>
          <TouchableOpacity className="bg-primary rounded py-3">
            <Text className="text-white text-center font-bold text-base">
              Comandă
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
