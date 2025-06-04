// utils/toast.ts
import Toast from "react-native-toast-message";

export const showToast = (
  message: string,
  type: "success" | "error" = "success"
) => {
  Toast.show({
    type,
    text1: message,
    visibilityTime: 2000,
    position: "bottom",
  });
};
