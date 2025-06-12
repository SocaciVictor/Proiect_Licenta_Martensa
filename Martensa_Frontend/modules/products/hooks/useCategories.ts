// modules/products/hooks/useCategories.ts
import { useRefreshStore } from "@/hooks/useRefreshStore";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

export interface CategoryResponse {
  id: number;
  name: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshVersion = useRefreshStore((state) => state.refreshVersion);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Eroare la preluarea categoriilor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [refreshVersion]);

  return { categories, loading };
}
