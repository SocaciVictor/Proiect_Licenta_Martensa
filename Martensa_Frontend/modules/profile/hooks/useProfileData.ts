// modules/profile/hooks/useProfileData.ts
import { useUserProfile } from "@/modules/auth/hooks/useUserProfile";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";

export const useProfileData = () => {
  const profile = useUserProfile();
  const logout = useAuthStore((state) => state.logout);
  const authenticated = useAuthStore((state) => state.authenticated);

  return {
    profile,
    logout,
    authenticated,
  };
};
