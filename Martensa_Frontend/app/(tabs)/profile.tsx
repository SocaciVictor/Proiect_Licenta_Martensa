import { useAuth } from "@/app/context/AuthContext";
import { useUserProfile } from "@/modules/auth/hooks/useUserProfile";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { authState, onLogout } = useAuth();
  const profile = useUserProfile();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-2xl font-bold text-dark mb-4">Profil</Text>

        {/* Informații utilizator */}
        {authState?.authenticated && profile && (
          <View className="mb-6">
            <Text className="text-xl font-semibold text-dark">
              {profile.firstName} {profile.lastName}
            </Text>
            <Text className="text-gray-600">{profile.email}</Text>
          </View>
        )}

        {/* Cumpărături */}
        <Text className="text-lg font-semibold text-dark mb-2">
          Cumpărături
        </Text>
        <View className="bg-gray-50 rounded-lg mb-4">
          <ProfileItem icon="document-text-outline" label="Bonurile mele" />
          <ProfileItem icon="clipboard-outline" label="Comenzi" />
          <ProfileItem icon="heart-outline" label="Liste" />
          <ProfileItem icon="cart-outline" label="Cumpărat recent" noBorder />
        </View>

        {/* Beneficii și loialitate */}
        <Text className="text-lg font-semibold text-dark mb-2">
          Program de loialitate și beneficii
        </Text>
        <View className="bg-gray-50 rounded-lg mb-4">
          <ProfileItem icon="pricetag-outline" label="Promoții personalizate" />
          <ProfileItem icon="barcode-outline" label="Card Connect" />
          <ProfileItem
            icon="pie-chart-outline"
            label="Economiile mele"
            noBorder
          />
        </View>

        {/* Detalii cont */}
        <Text className="text-lg font-semibold text-dark mb-2">
          Detalii cont
        </Text>
        <View className="bg-gray-50 rounded-lg mb-4">
          <ProfileItem icon="person-outline" label="Informații personale" />
          <ProfileItem icon="location-outline" label="Adresele mele" />
          <ProfileItem icon="card-outline" label="Cardurile mele" noBorder />
        </View>

        {/* Relații clienți */}
        <Text className="text-lg font-semibold text-dark mb-2">
          Relații clienți
        </Text>
        <View className="bg-gray-50 rounded-lg mb-4">
          <ProfileItem icon="help-circle-outline" label="Întrebări frecvente" />
          <ProfileItem icon="mail-outline" label="Formular de contact" />
          <ProfileItem
            icon="call-outline"
            label="Sună la Relații Clienți"
            noBorder
          />
        </View>

        {/* Despre noi */}
        <Text className="text-lg font-semibold text-dark mb-2">Despre noi</Text>
        <View className="bg-gray-50 rounded-lg mb-6">
          <ProfileItem
            icon="shield-checkmark-outline"
            label="Declarație de confidențialitate"
          />
          <ProfileItem icon="document-outline" label="Termeni și condiții" />
          <ProfileItem
            icon="information-circle-outline"
            label="Despre Mega Image"
            noBorder
          />
        </View>

        {/* Logout dacă e logat */}
        {authState?.authenticated && (
          <TouchableOpacity
            onPress={onLogout}
            className="border border-gray-300 rounded-lg p-3"
          >
            <Text className="text-center text-red-600 font-semibold">
              Ieșire din cont
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const ProfileItem = ({
  icon,
  label,
  noBorder = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  noBorder?: boolean;
}) => (
  <TouchableOpacity
    className={`flex-row items-center justify-between px-4 py-3 ${
      noBorder ? "" : "border-b border-gray-200"
    }`}
  >
    <View className="flex-row items-center">
      <Ionicons name={icon} size={20} color="#28a745" />
      <Text className="ml-3 text-dark text-base">{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
);
