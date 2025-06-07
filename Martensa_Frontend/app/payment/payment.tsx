import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import PayButton from "@/modules/payments/components/PayButton";
import { useStripeCheckout } from "@/modules/payments/hooks/useStripeCheckout";
import { useSelectedStore } from "@/modules/stores/store/useSelectedStore";
import { useNavigation } from "@react-navigation/native";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentScreen() {
  const { selectedStoreId, selectedStoreName, clearSelectedStore } =
    useSelectedStore();
  const { total, products, quantities, clearCart } = useCartStore();
  const navigation = useNavigation();
  const userId = useAuthStore((state) => state.userId);
  const user = useAuthStore((state) => state.user);
  const { checkout } = useStripeCheckout();

  const handlePlaceOrder = async () => {
    if (!selectedStoreId) {
      alert("Selectează un magazin mai întâi!");
      return;
    }

    const orderPayload = {
      storeId: selectedStoreId,
      products: products.map((p) => ({
        productId: p.id,
        quantity: quantities[p.id] || 1,
      })),
      shippingAddress: user?.address,
      paymentMethod: "CARD",
    };

    const checkoutPayloadBuilder = (orderId: number) => ({
      orderId,
      userId: userId,
      products: products.map((p) => ({
        amount: Math.round((p.discountPrice ?? p.price) * 100),
        quantity: quantities[p.id] || 1,
        name: p.name,
        currency: "RON",
      })),
    });

    console.log("Placing order with payload:", orderPayload);
    console.log("Checkout payload builder:", checkoutPayloadBuilder);

    const result = await checkout(orderPayload, checkoutPayloadBuilder);

    if (result.success) {
      console.log("Checkout flow launched for order:", result.orderId);
    } else {
      alert("Eroare la procesarea plății!");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-xl font-bold mb-4">Finalizare plată</Text>

      <Text className="mb-2">
        Magazin selectat:{" "}
        <Text className="font-bold text-green-600">
          {selectedStoreName ?? "Neselectat"}
        </Text>
      </Text>

      <Text className="mb-4">
        Total: <Text className="font-bold text-lg">{total.toFixed(2)} Lei</Text>
      </Text>

      <PayButton onPress={handlePlaceOrder} />
    </SafeAreaView>
  );
}
