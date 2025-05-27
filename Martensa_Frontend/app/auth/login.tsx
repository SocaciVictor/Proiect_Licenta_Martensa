import { SafeAreaView } from "react-native";
import LoginForm from "../../modules/auth/components/LoginForm";

export default function LoginScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <LoginForm />
    </SafeAreaView>
  );
}
