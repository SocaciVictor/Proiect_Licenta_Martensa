import { ProfileItem } from "@/modules/profile/components/ProfileItem";
import { useProfileData } from "@/modules/profile/hooks/useProfileData";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { profile, logout, authenticated } = useProfileData();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white relative">
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 112 }}
        className="flex-1"
      >
        <Text className="text-2xl font-bold text-black mb-4">Profil</Text>

        {/* === NEAUTENTIFICAT === */}
        {!authenticated && (
          <>
            <Text className="text-lg font-semibold text-black mb-2">
              Relații clienți
            </Text>
            <View className="bg-gray-50 rounded-lg mb-4">
              <ProfileItem
                icon="help-circle-outline"
                label="Întrebări frecvente"
              />
              <ProfileItem icon="mail-outline" label="Formular de contact" />
              <ProfileItem
                icon="call-outline"
                label="Sună la Relații Clienți"
                noBorder
              />
            </View>

            <Text className="text-lg font-semibold text-black mb-2">
              Despre noi
            </Text>
            <View className="bg-gray-50 rounded-lg mb-6">
              <ProfileItem
                icon="shield-checkmark-outline"
                label="Declarație de confidențialitate"
              />
              <ProfileItem
                icon="document-outline"
                label="Termeni și condiții"
              />
              <ProfileItem
                icon="information-circle-outline"
                label="Despre Martensa"
                noBorder
              />
            </View>
          </>
        )}

        {/* === AUTENTIFICAT === */}
        {authenticated && profile && (
          <>
            <View className="mb-6">
              <Text className="text-xl font-semibold text-black">
                {profile.firstName} {profile.lastName}
              </Text>
              <Text className="text-gray-600">{profile.email}</Text>
            </View>

            <Text className="text-lg font-semibold text-black mb-2">
              Cumpărături
            </Text>
            <View className="bg-gray-50 rounded-lg mb-4">
              <ProfileItem icon="document-text-outline" label="Bonurile mele" />
              <ProfileItem icon="clipboard-outline" label="Comenzi" />
              <ProfileItem icon="heart-outline" label="Liste" />
              <ProfileItem
                icon="cart-outline"
                label="Cumpărat recent"
                noBorder
              />
            </View>

            <Text className="text-lg font-semibold text-black mb-2">
              Program de loialitate și beneficii
            </Text>
            <View className="bg-gray-50 rounded-lg mb-4">
              <ProfileItem
                icon="pricetag-outline"
                label="Promoții personalizate"
              />
              <ProfileItem
                icon="barcode-outline"
                label="Card Martensa Connect"
              />
              <ProfileItem
                icon="pie-chart-outline"
                label="Economiile mele"
                noBorder
              />
            </View>

            <Text className="text-lg font-semibold text-black mb-2">
              Detalii cont
            </Text>
            <View className="bg-gray-50 rounded-lg mb-4">
              <ProfileItem icon="person-outline" label="Informații personale" />
              <ProfileItem icon="location-outline" label="Adresele mele" />
              <ProfileItem
                icon="card-outline"
                label="Cardurile mele"
                noBorder
              />
            </View>

            <Text className="text-lg font-semibold text-black mb-2">
              Relații clienți
            </Text>
            <View className="bg-gray-50 rounded-lg mb-4">
              <ProfileItem
                icon="help-circle-outline"
                label="Întrebări frecvente"
              />
              <ProfileItem icon="mail-outline" label="Formular de contact" />
              <ProfileItem
                icon="call-outline"
                label="Sună la Relații Clienți"
                noBorder
              />
            </View>

            <Text className="text-lg font-semibold text-black mb-2">
              Despre noi
            </Text>
            <View className="bg-gray-50 rounded-lg mb-6">
              <ProfileItem
                icon="shield-checkmark-outline"
                label="Declarație de confidențialitate"
              />
              <ProfileItem
                icon="document-outline"
                label="Termeni și condiții"
              />
              <ProfileItem
                icon="information-circle-outline"
                label="Despre Martensa"
                noBorder
              />
            </View>

            <TouchableOpacity
              onPress={logout}
              className="border border-gray-300 rounded-lg p-3"
            >
              <Text className="text-center text-red-600 font-semibold">
                Ieșire din cont
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* === Buton verde jos, doar pentru NELOGAT === */}
      {!authenticated && (
        <View className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <TouchableOpacity
            onPress={() => router.push("/auth/login")}
            className="bg-green-600 rounded-lg py-4"
          >
            <Text className="text-white text-center font-semibold text-base">
              Intră în cont
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
