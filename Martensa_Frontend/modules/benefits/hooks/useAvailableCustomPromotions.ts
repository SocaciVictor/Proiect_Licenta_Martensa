import { useRefreshStore } from "@/hooks/useRefreshStore";
import { PromotionDto } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

export function useAvailableCustomPromotions(userId?: number | null) {
  const [availablePromotions, setAvailablePromotions] = useState<
    PromotionDto[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshVersion = useRefreshStore((state) => state.refreshVersion);

  useEffect(() => {
    const fetchAvailablePromotions = async () => {
      if (!userId) return; // nu apelăm dacă nu avem userId

      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(
          `/promotions/user/${userId}/available-custom`
        );
        setAvailablePromotions(response.data);
      } catch (err) {
        console.error("Eroare la fetch available promotions:", err);
        setError("Eroare la încărcarea promoțiilor disponibile.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailablePromotions();
  }, [userId, refreshVersion]);

  return {
    availablePromotions,
    loading,
    error,
  };
}
