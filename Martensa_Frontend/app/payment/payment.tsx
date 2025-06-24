import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useCartStore } from "@/modules/cart/store/useCartStore";
import PayButton from "@/modules/payments/components/PayButton";
import { useStripeCheckout } from "@/modules/payments/hooks/useStripeCheckout";
import { useSelectedStore } from "@/modules/stores/store/useSelectedStore";
import apiClient from "@/services/apiClient";
import { router } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentScreen() {
  const { selectedStoreId, selectedStoreName, clearSelectedStore } =
    useSelectedStore();
  const { total, products, quantities, clearCart } = useCartStore();
  const userId = useAuthStore((state) => state.userId);
  const user = useAuthStore((state) => state.user);
  const { checkout } = useStripeCheckout();

  const [orderId, setOrderId] = useState<number | null>(null);

  const handlePlaceOrder = async () => {
    if (!selectedStoreId) {
      alert("Selectează un magazin mai întâi!");
      return;
    }

    const orderPayload = {
      storeId: selectedStoreId,
      products: products.map((p) => ({
        productId: p.id, // foarte important pentru stock decrease!
        quantity: quantities[p.id] || 1,
      })),
      shippingAddress: user?.address,
      paymentMethod: "CARD",
    };

    const checkoutPayloadBuilder = (orderId: number) => ({
      orderId,
      userId: userId,
      products: products.map((p) => ({
        productId: p.id, // aici e cheia!
        amount: Math.round((p.discountPrice ?? p.price) * 100),
        quantity: quantities[p.id] || 1,
        name: p.name,
        currency: "RON",
      })),
    });

    console.log("Placing order with payload:", orderPayload);

    const result = await checkout(orderPayload, checkoutPayloadBuilder);

    if (result.success) {
      console.log("Checkout flow launched for order:", result.orderId);
      setOrderId(result.orderId);
      router.push(`/succes/${result.orderId}`);
    } else {
      alert("Eroare la procesarea plății!");
    }
  };

  const handleCheckPaymentStatus = async () => {
    if (!orderId) return;

    try {
      const res = await apiClient.get(`/orders/${orderId}/status`);
      const status = res.data;
      console.log("🕵️ Order status:", status);

      if (status === "COMPLETED") {
        clearCart();
        router.replace(`/succes/${orderId}`);
      } else if (status === "FAILED") {
        router.replace(`/cancel/${orderId}`);
      } else {
        alert(`Status actual: ${status}. Încearcă din nou mai târziu.`);
      }
    } catch (err) {
      console.error("Eroare la verificarea statusului comenzii:", err);
      alert("Eroare la verificarea statusului comenzii!");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 justify-center items-center">
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

      {!orderId && <PayButton onPress={handlePlaceOrder} />}

      {orderId && (
        <TouchableOpacity
          className="bg-blue-600 py-3 rounded-sm mt-4 w-full"
          onPress={handleCheckPaymentStatus}
        >
          <Text className="text-white text-center font-bold text-base">
            Verifică status plată
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
