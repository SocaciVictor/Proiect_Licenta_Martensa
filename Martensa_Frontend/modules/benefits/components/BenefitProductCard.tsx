import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { PromotionDto } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  promotion: PromotionDto;
};

export default function BenefitPromotionCard({ promotion }: Props) {
  const user = useAuthStore((state) => state.user);
  const [activated, setActivated] = useState(
    promotion.userIds?.includes(user?.id ?? -1)
  );

  const handleActivate = async () => {
    try {
      await apiClient.post(`/promotions/${promotion.id}/activate`, null, {
        params: { userId: user?.id },
      });
      setActivated(true);
    } catch (err) {
      console.error("Eroare la activarea promoției:", err);
    }
  };

  return (
    <View className="bg-white border border-gray-300 rounded-lg p-4 mb-3">
      <Text className="text-lg font-bold mb-1">{promotion.title}</Text>
      <Text className="text-sm text-gray-600 mb-2">
        {promotion.description}
      </Text>
      <Text className="text-sm text-gray-500 mb-2">
        Valabilă între {promotion.startDate} și {promotion.endDate}
      </Text>
      <Text className="text-sm font-semibold mb-2">
        Reducere: {promotion.discountPercentage}%
      </Text>

      {promotion.promotionType === "ALL" ? (
        <Text className="text-green-600 font-semibold">
          Se aplică tuturor utilizatorilor automat
        </Text>
      ) : activated ? (
        <Text className="text-green-600 font-semibold">
          Activată pentru tine
        </Text>
      ) : (
        <TouchableOpacity
          className="mt-2 py-2 px-4 bg-[#28a745] rounded items-center"
          onPress={handleActivate}
        >
          <Text className="text-white font-semibold">Activează promoția</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
