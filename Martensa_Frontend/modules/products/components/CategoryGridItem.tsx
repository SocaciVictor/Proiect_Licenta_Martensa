import { Image, Text, TouchableOpacity } from "react-native";

type Props = {
  name: string;
  imageUrl?: string;
  onPress: () => void;
};

export default function CategoryGridItem({ name, imageUrl, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[47%] h-40 bg-gray-100 rounded-xl mb-3 items-center justify-center px-2"
      style={{ marginBottom: 12 }}
    >
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          className="w-16 h-16 mb-2"
          resizeMode="contain"
        />
      )}
      <Text
        className="text-center text-sm font-semibold text-gray-800"
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}
