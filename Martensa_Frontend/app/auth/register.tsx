import RegisterForm from "@/modules/auth/components/RegisterForm";
import { Text, View } from "react-native";

export default function RegisterScreen() {
  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center">Înregistrare</Text>
      <RegisterForm />
    </View>
  );
}
