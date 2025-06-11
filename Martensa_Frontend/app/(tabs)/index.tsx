import { useUserProfile } from "@/modules/auth/hooks/useUserProfile";
import SearchOverlay from "@/modules/products/components/SearchOverlay";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const profile = useUserProfile();
  const points = profile?.loyaltyCard?.points ?? 0;
  const name = profile?.firstName ?? "Utilizator";

  return (
    <View className="flex-1 bg-white relative">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 100,
        }}
      >
        {/* 🔍 Search Overlay vizibil mereu */}
        <SearchOverlay />

        {/* Restul vizibil DOAR dacă e autentificat */}
        {profile && (
          <>
            {/* 👋 Salut {nume} */}
            <Text className="text-xl font-bold text-black mb-4">
              Salut, {name}!
            </Text>

            {/* 🟢 Secțiune scroll orizontală */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-6"
            >
              <View className="flex-row space-x-4">
                {/* Card: Puncte */}
                <View className="bg-[#e6f5ea] border border-[#28a745] rounded-xl p-4 w-64">
                  <Text className="text-[#28a745] font-bold text-base mb-1">
                    Punctele tale
                  </Text>
                  <Text className="text-3xl font-extrabold text-black mb-2">
                    {points}
                  </Text>
                  <Text className="text-sm text-gray-600">
                    Folosește-le pentru reduceri!
                  </Text>
                </View>

                {/* Card: Reduceri */}
                <View className="bg-[#fff5f5] border border-[#ffcaca] rounded-xl p-4 w-64">
                  <Text className="text-[#cc0000] font-bold text-base mb-1">
                    Reduceri active
                  </Text>
                  <Text className="text-sm text-black mb-1">
                    10% reducere comenzi peste 50 Lei
                  </Text>
                  <Text className="text-xs text-gray-600">
                    Până la 15 Iunie
                  </Text>
                </View>

                {/* Card: Oferte personalizate */}
                <View className="bg-[#f0f7ff] border border-[#cce1ff] rounded-xl p-4 w-64">
                  <Text className="text-[#0077cc] font-bold text-base mb-1">
                    Oferte personalizate
                  </Text>
                  <Text className="text-sm text-black mb-1">
                    Transport gratuit peste 100 Lei
                  </Text>
                  <Text className="text-xs text-gray-600">
                    Activ pentru conturi Connect
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* ⏱️ Interval livrare */}
            <View className="bg-gray-50 rounded-lg p-3 flex-row items-center justify-between">
              <View className="flex-1 pr-2">
                <Text className="text-black font-semibold">
                  Selectează intervalul
                </Text>
                <Text className="text-gray-600 text-sm">
                  Când vrei să primești produsele?
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
