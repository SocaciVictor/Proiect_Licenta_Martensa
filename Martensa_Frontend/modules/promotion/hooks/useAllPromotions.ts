import { getAllPromotions } from "@/modules/promotion/api/promotionApi";
import { PromotionDto } from "@/modules/promotion/types/promotionTypes";
import { useEffect, useState } from "react";

export const useAllPromotions = () => {
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const data = await getAllPromotions();
      setPromotions(data);
    } catch (err) {
      console.error("Eroare la fetch promotions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  return { promotions, loading, reload: loadPromotions };
};
