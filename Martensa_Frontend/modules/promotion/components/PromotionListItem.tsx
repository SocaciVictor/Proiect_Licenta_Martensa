import { PromotionDto } from "@/modules/auth/types/auth";
import { deletePromotion } from "@/modules/promotion/api/promotionApi";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

type Props = {
  promotion: PromotionDto;
  onDeleted: () => void;
};

export default function PromotionListItem({ promotion, onDeleted }: Props) {
  const handleDelete = async () => {
    try {
      await deletePromotion(promotion.id);
      Toast.show({
        type: "success",
        text1: "Promoția a fost ștearsă",
      });
      onDeleted();
    } catch (err) {
      console.error("Eroare la ștergere promoție:", err);
      Toast.show({
        type: "error",
        text1: "Eroare la ștergere promoție",
      });
    }
  };

  return (
    <View className="border border-gray-300 rounded-lg p-4 mb-3 bg-white">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold">{promotion.title}</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>

      <Text className="text-sm text-gray-700 mb-1">
        {promotion.description}
      </Text>
      <Text className="text-sm text-gray-500 mb-1">
        Perioadă: {promotion.startDate} - {promotion.endDate}
      </Text>
      <Text className="text-sm text-gray-500 mb-1">
        Tip: {promotion.promotionType}
      </Text>
      <Text className="text-sm text-gray-500">
        Reducere: {promotion.discountPercentage}%
      </Text>
    </View>
  );
}
