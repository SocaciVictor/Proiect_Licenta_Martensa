import { useUserProfile } from "@/modules/auth/hooks/useUserProfile";
import BenefitPromotionCard from "@/modules/benefits/components/BenefitProductCard";
import { useBenefits } from "@/modules/benefits/hooks/useBenefits";
import { ScrollView, Text, View } from "react-native";

export default function BenefitsScreen() {
  const { promotions, loading, error } = useBenefits();
  const profile = useUserProfile();
  const points = profile?.loyaltyCard?.points ?? 0;

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4">
      {/* CARD CU PUNCTELE */}
      <View className="bg-[#28a745] rounded-xl p-4 mb-4">
        <Text className="text-white text-lg font-semibold mb-1">
          🎁 Punctele tale de fidelitate
        </Text>
        <Text className="text-3xl text-white font-bold">{points} puncte</Text>
      </View>

      {/* PROMOTII */}
      <Text className="text-xl font-bold mb-2">Promoții pentru tine</Text>

      {loading && <Text>Se încarcă promoțiile...</Text>}

      {error && <Text className="text-red-600">{error}</Text>}

      {promotions.length === 0 && !loading && !error && (
        <Text className="text-gray-500">
          Momentan nu există promoții active.
        </Text>
      )}

      <View className="flex-col space-y-3">
        {promotions.map((promotion) => (
          <BenefitPromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </View>
    </ScrollView>
  );
}
