import { useRefreshStore } from "@/hooks/useRefreshStore";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { PromotionDto } from "@/modules/auth/types/auth";
import { fetchUserPromotions } from "@/modules/benefits/api/api";
import { useEffect, useState } from "react";

export const useBenefits = () => {
  const user = useAuthStore((state) => state.user);
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshVersion = useRefreshStore((state) => state.refreshVersion);

  useEffect(() => {
    const loadPromotions = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const promos = await fetchUserPromotions(user.id);
        setPromotions(promos);
      } catch (err) {
        setError("Eroare la încărcarea promoțiilor.");
        console.error("Error loading promotions", err);
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, [user?.id, refreshVersion]);

  return { promotions, loading, error };
};
