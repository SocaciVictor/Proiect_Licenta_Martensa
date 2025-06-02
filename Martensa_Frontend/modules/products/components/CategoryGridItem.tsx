// modules/products/components/CategoryGridItem.tsx
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  imageUrl: string;
  onPress: () => void;
}

export default function CategoryGridItem({ name, imageUrl, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} className="w-1/2 p-2">
      <View className="bg-white rounded-lg items-center p-3 shadow-sm border border-gray-100">
        <Image
          source={{ uri: imageUrl }}
          className="w-20 h-20 mb-2"
          resizeMode="contain"
        />
        <Text className="text-center text-sm font-medium text-gray-800">
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
