import { deletePromotion } from "@/modules/promotion/api/promotionApi";
import { PromotionDto } from "@/modules/promotion/types/promotionTypes";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

type Props = {
  promotions: PromotionDto[];
  onReload: () => void;
};

export default function PromotionList({ promotions, onReload }: Props) {
  const handleDelete = async (id: number) => {
    try {
      await deletePromotion(id);
      Toast.show({
        type: "success",
        text1: "Promoție ștearsă cu succes!",
      });
      onReload();
    } catch (err) {
      console.error("Eroare la ștergere promoție", err);
      Toast.show({
        type: "error",
        text1: "Eroare la ștergere promoție",
      });
    }
  };

  return (
    <FlatList
      data={promotions}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingBottom: 20 }}
      renderItem={({ item }) => (
        <View className="border border-gray-300 rounded-lg p-4 mb-3">
          <View className="flex-row justify-between mb-2">
            <Text className="font-bold">{item.title}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash-outline" size={22} color="#cc0000" />
            </TouchableOpacity>
          </View>
          <Text className="text-gray-700 mb-1">{item.description}</Text>
          <Text className="text-sm text-gray-600 mb-1">
            Tip: {item.promotionType}
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            Perioadă: {item.startDate} - {item.endDate}
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            Reducere: {item.discountPercentage}%
          </Text>
          <Text className="text-sm text-gray-600 mb-1">
            Nr. produse: {item.productIds.length}
          </Text>
          <Text className="text-sm text-gray-600">
            Nr. useri: {item.userIds.length}
          </Text>
        </View>
      )}
      ListEmptyComponent={
        <Text className="text-center mt-8 text-gray-500">
          Nu există promoții.
        </Text>
      }
    />
  );
}
