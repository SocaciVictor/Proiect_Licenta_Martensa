import { useRefreshStore } from "@/hooks/useRefreshStore";
import { useUserProfile } from "@/modules/auth/hooks/useUserProfile";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import BenefitPromotionCard from "@/modules/benefits/components/BenefitProductCard";
import { useAvailableCustomPromotions } from "@/modules/benefits/hooks/useAvailableCustomPromotions";
import { useBenefits } from "@/modules/benefits/hooks/useBenefits";
import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function BenefitsScreen() {
  const { promotions, loading, error } = useBenefits();
  const profile = useUserProfile();
  const points = profile?.loyaltyCard?.points ?? 0;
  const authenticated = useAuthStore((state) => state.authenticated);
  const userId = useAuthStore((state) => state.userId);
  const incrementRefreshVersion = useRefreshStore(
    (state) => state.incrementRefreshVersion
  );

  const {
    availablePromotions,
    loading: loadingAvailable,
    error: errorAvailable,
  } = useAvailableCustomPromotions(userId);

  const activatedPromotions = promotions.filter((promotion) => {
    if (promotion.promotionType === "ALL") return true;
    if (
      promotion.promotionType === "CUSTOM" &&
      promotion.userIds &&
      promotion.userIds.includes(userId ?? -1)
    ) {
      return true;
    }
    return false;
  });

  if (!authenticated) {
    return (
      <ScrollView className="flex-1 bg-white px-4 py-4">
        <View className="bg-[#f3f3f3] rounded-xl p-4 mb-4 items-center justify-center">
          <Image
            source={require("../../assets/images/card-icon.png")}
            className="w-24 h-24 mb-3"
            resizeMode="contain"
          />
          <Text className="text-lg font-semibold mb-2 text-center">
            Conectează-te pentru a vedea promoțiile tale și a acumula puncte de
            fidelitate!
          </Text>
          <Text className="text-sm text-gray-600 mb-4 text-center">
            1 leu cheltuit = 1 punct de fidelitate
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            className="bg-[#28a745] px-6 py-3 rounded-full"
          >
            <Text className="text-white font-bold text-center">
              Conectează-te
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-4">
      <View className="bg-[#28a745] rounded-xl p-4 mb-4">
        <Text className="text-white text-lg font-semibold mb-1">
          🎁 Punctele tale de fidelitate
        </Text>
        <Text className="text-3xl text-white font-bold">{points} puncte</Text>
      </View>

      {/* Secțiunea: Promoții active */}
      <Text className="text-xl font-bold mb-2">Promoțiile tale active</Text>

      {loading && <Text>Se încarcă promoțiile...</Text>}

      {error && <Text className="text-red-600">{error}</Text>}

      {activatedPromotions.length === 0 && !loading && !error && (
        <Text className="text-gray-500">Momentan nu ai promoții active.</Text>
      )}

      <View className="flex-col space-y-3 mb-6">
        {activatedPromotions.map((promotion) => (
          <BenefitPromotionCard
            key={promotion.id}
            promotion={promotion}
            onActivateSuccess={incrementRefreshVersion}
          />
        ))}
      </View>

      {/* Secțiunea: Promoții disponibile pentru activare */}
      <Text className="text-xl font-bold mb-2">
        Promoții pe care le poți activa
      </Text>

      {loadingAvailable && <Text>Se încarcă promoțiile disponibile...</Text>}

      {errorAvailable && <Text className="text-red-600">{errorAvailable}</Text>}

      {availablePromotions.length === 0 &&
        !loadingAvailable &&
        !errorAvailable && (
          <Text className="text-gray-500">
            Momentan nu există promoții disponibile pentru activare.
          </Text>
        )}

      <View className="flex-col space-y-3">
        {availablePromotions.map((promotion) => (
          <BenefitPromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </View>
    </ScrollView>
  );
}
