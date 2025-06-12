import { UserProfileResponse } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";
import { useEffect, useState } from "react";

export const useAllUsers = () => {
  const [users, setUsers] = useState<UserProfileResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<UserProfileResponse[]>("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Eroare la fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return { users, loading };
};
