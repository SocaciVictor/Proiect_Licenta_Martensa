import { useRefreshStore } from "@/hooks/useRefreshStore";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { UserProfileResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

export const useUserProfile = () => {
  const email = useAuthStore((state) => state.email);
  const token = useAuthStore((state) => state.token);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const refreshVersion = useRefreshStore((state) => state.refreshVersion);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email || !token) return;

      try {
        const response = await apiClient.get<UserProfileResponse>("/users/me", {
          headers: { "X-User-Email": email },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Eroare la fetch profile:", error);
      }
    };

    fetchProfile();
  }, [email, token, refreshVersion]);

  return profile;
};
