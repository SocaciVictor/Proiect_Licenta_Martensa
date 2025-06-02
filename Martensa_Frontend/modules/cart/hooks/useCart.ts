// modules/cart/hooks/useCart.ts
import { useUserProfile } from "@/modules/auth/hooks/useUserProfile";
import { CartProduct, CartResponse } from "@/modules/cart/types/cart";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

export const useCart = () => {
  const user = useUserProfile();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({});

  const fetchCart = async () => {
    if (!user?.email) return;
    try {
      const response = await apiClient.get<CartResponse>("/carts/me", {
        headers: { "X-User-Email": user.email },
      });
      setCart(response.data);

      const countMap: { [id: number]: number } = {};
      for (const p of response.data.products) {
        countMap[p.id] = (countMap[p.id] || 0) + 1;
      }
      setQuantities(countMap);
    } catch (error) {
      console.error("Eroare la fetch cart:", error);
    }
  };

  const addProduct = async (productId: number) => {
    if (!user?.email) return;
    await apiClient.post(
      "/carts/add",
      { productId },
      { headers: { "X-User-Email": user.email } }
    );
    fetchCart();
  };

  const removeProduct = async (productId: number) => {
    if (!user?.email) return;
    await apiClient.delete("/carts/remove", {
      headers: { "X-User-Email": user.email },
      data: { productId },
    });
    fetchCart();
  };

  const clearCart = async () => {
    if (!user?.email) return;
    await apiClient.delete("/carts/clear", {
      headers: { "X-User-Email": user.email },
    });
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, [user?.email]);

  const total = cart?.products.reduce(
    (acc, p) => acc + (p.discountPrice || p.price),
    0
  );

  const uniqueProducts = Object.values(
    cart?.products.reduce((acc, p) => {
      if (!acc[p.id]) acc[p.id] = p;
      return acc;
    }, {} as { [id: number]: CartProduct }) || {}
  );

  return {
    cart,
    total,
    quantities,
    products: uniqueProducts,
    addProduct,
    removeProduct,
    clearCart,
    refetch: fetchCart,
  };
};
