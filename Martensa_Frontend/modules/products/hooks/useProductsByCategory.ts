// modules/products/hooks/useProductsByCategory.ts
import { ProductResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

export const useProductsByCategory = (categoryId: string | string[]) => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient.get(`/products/category/${categoryId}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Eroare la fetch produse:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [categoryId]);

  return { products, loading };
};
