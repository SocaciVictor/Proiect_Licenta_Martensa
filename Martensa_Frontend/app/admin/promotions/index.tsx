import { PromotionDto } from "@/modules/auth/types/auth";
import { getAllPromotions } from "@/modules/promotion/api/promotionApi";
import PromotionForm from "@/modules/promotion/components/PromotionForm";
import PromotionListItem from "@/modules/promotion/components/PromotionListItem";
import { useEffect, useState } from "react";
import { ScrollView, Text } from "react-native";

export default function PromotionsAdminScreen() {
  const [promotions, setPromotions] = useState<PromotionDto[]>([]);

  const loadPromotions = async () => {
    try {
      const res = await getAllPromotions();
      setPromotions(res);
    } catch (err) {
      console.error("Eroare la fetch promoții:", err);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4">
      <Text className="text-2xl font-bold mb-4 text-center">
        Gestiune Promoții
      </Text>

      {/* Lista promoții */}
      {promotions.length === 0 ? (
        <Text className="text-gray-500 mb-4 text-center">
          Nu există promoții încă.
        </Text>
      ) : (
        promotions.map((promotion) => (
          <PromotionListItem
            key={promotion.id}
            promotion={promotion}
            onDeleted={loadPromotions}
          />
        ))
      )}

      {/* Form de creare */}
      <PromotionForm onCreated={loadPromotions} />
    </ScrollView>
  );
}
