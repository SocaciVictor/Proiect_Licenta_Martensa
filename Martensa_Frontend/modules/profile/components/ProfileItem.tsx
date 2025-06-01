// modules/profile/components/ProfileItem.tsx
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  noBorder?: boolean;
}

export const ProfileItem = ({ icon, label, noBorder = false }: Props) => (
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
