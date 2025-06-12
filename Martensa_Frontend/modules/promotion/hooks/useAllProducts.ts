import { ProductResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

export const useAllProducts = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Eroare la fetch produse:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, loading };
};
