import { Text, TouchableOpacity } from "react-native";

export default function PayButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      className="bg-green-600 py-3 rounded-lg mt-4"
      onPress={onPress}
    >
      <Text className="text-white text-center font-bold text-base">
        Plătește comanda
      </Text>
    </TouchableOpacity>
  );
}
