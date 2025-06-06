import apiClient from "@/services/apiClient";

export const createOrder = async (orderPayload: any) => {
  const res = await apiClient.post("/orders", orderPayload);
  return res.data; // { id: ..., ... }
};

export const createStripeCheckout = async (checkoutPayload: any) => {
  const res = await apiClient.post(
    "/payments/stripe/checkout",
    checkoutPayload
  );
  return res.data; // { sessionUrl: ... }
};
