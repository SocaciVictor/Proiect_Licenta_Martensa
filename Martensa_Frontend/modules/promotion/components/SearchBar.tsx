import { Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <View className="flex-row items-center border border-gray-300 rounded px-2 py-1 mb-3">
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder || "Caută..."}
        className="flex-1 text-black"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange("")} className="ml-2">
          <Text className="text-gray-500">✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
