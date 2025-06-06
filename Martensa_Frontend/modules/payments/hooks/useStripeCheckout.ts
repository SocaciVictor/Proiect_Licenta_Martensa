import * as Linking from "expo-linking";
import { createOrder, createStripeCheckout } from "../api/paymentApi";

export const useStripeCheckout = () => {
  const checkout = async (
    orderPayload: any,
    checkoutPayloadBuilder: (orderId: number) => any
  ) => {
    try {
      // 1️⃣ Creează comanda
      const orderData = await createOrder(orderPayload);
      const orderId = orderData.id;
      console.log("✅ Order placed with ID:", orderId);

      // 2️⃣ Stripe Checkout
      const stripePayload = checkoutPayloadBuilder(orderId);
      const stripeData = await createStripeCheckout(stripePayload);

      console.log("Stripe session URL:", stripeData.sessionUrl);

      if (stripeData.sessionUrl) {
        Linking.openURL(stripeData.sessionUrl);
      } else {
        console.error("Nu s-a primit URL-ul sesiunii Stripe");
        return {
          success: false,
          error: "Nu s-a primit URL-ul sesiunii Stripe",
        };
      }
      return { success: true, orderId };
    } catch (err) {
      console.error("Eroare în Stripe Checkout:", err);
      return { success: false, error: err };
    }
  };

  return { checkout };
};
