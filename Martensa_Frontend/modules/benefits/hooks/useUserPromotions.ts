import { useRefreshStore } from "@/hooks/useRefreshStore";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

export type PromotionDto = {
  id: number;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  promotionType: string;
  productIds: number[];
  userIds: number[];
};

export const useUserPromotions = () => {
  const userId = useAuthStore((state) => state.userId);
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const refreshVersion = useRefreshStore((state) => state.refreshVersion);

  useEffect(() => {
    const fetchPromotions = async () => {
      if (!userId) return;
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get<PromotionDto[]>(
          `/promotions/user/${userId}`
        );
        setPromotions(response.data);
      } catch (err) {
        console.error("Eroare la fetch promotions:", err);
        setError("Nu s-au putut încărca promoțiile.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, [userId, refreshVersion]);

  // 👇 aici extragem toate productId-urile unice din toate promoțiile
  const promotedProductIds = Array.from(
    new Set(promotions.flatMap((promo) => promo.productIds))
  );

  return { promotions, promotedProductIds, loading, error };
};
