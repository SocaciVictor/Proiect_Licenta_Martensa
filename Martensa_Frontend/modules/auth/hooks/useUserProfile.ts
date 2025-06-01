import { useAuth } from "@/app/context/AuthContext";
import { UserProfileResponse } from "@/modules/auth/types/auth"; // ajustează calea dacă e altă locație
import { decodeJwt } from "@/utils/decodeJwt";
import { useEffect, useState } from "react";
import apiClient from "../../../services/apiClient"; // asigură-te că ai configurat corect apiClient

export const useUserProfile = () => {
  const { authState } = useAuth();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authState?.token) {
        console.log("Token lipsă, nu se face fetch.");
        return;
      }

      const decoded = decodeJwt(authState.token);
      const email = decoded?.email;
      if (!email) return;

      try {
        const response = await apiClient.get<UserProfileResponse>("/users/me", {
          headers: { "X-User-Email": email },
        });
        setProfile(response.data);
        console.log("User profile fetched successfully:", response.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchProfile();
  }, [authState?.token]);

  return profile;
};
