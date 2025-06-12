import { useRefreshStore } from "@/hooks/useRefreshStore";
import { ProductResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

export const useProductsByCategory = (
  categoryId: string | string[] | undefined
) => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshVersion = useRefreshStore((state) => state.refreshVersion);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryId) return;
      try {
        const res = await apiClient.get(`/products/category/${categoryId}`);
        setProducts(res.data);
      } catch (error) {
        console.error("Eroare la fetch:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, refreshVersion]);

  return { products, loading };
};
