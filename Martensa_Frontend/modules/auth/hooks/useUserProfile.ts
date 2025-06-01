import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { UserProfileResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { decodeJwt } from "@/utils/decodeJwt";
import { useEffect, useState } from "react";

export const useUserProfile = () => {
  const token = useAuthStore((state) => state.token);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        console.log("Token lipsă, nu se face fetch.");
        return;
      }

      const decoded = decodeJwt(token);
      const email = decoded?.email || decoded?.sub;
      if (!email) {
        console.warn("Nu s-a putut decoda email-ul din JWT.");
        return;
      }

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
  }, [token]);

  return profile;
};
