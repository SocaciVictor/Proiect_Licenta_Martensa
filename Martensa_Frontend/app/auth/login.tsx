import LoginForm from "@/modules/auth/components/LoginForm";
import { View } from "react-native";

export default function LoginScreen() {
  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <LoginForm />
    </View>
  );
}
