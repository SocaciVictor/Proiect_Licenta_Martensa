import { useRefreshStore } from "@/hooks/useRefreshStore";
import { ProductResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

export const useProductsAll = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshVersion = useRefreshStore(
    (state) => state.incrementRefreshVersion
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiClient.get("/products");
        setProducts(res.data);
        refreshVersion();
      } catch (error) {
        console.error("Eroare la fetch all products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};
