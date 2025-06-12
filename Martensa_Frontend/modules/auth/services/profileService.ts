import apiClient from "../../../services/apiClient";

export const getUserProfile = async (email: string) => {
  const response = await apiClient.get(`/users/profile`, {
    headers: { "X-User-Email": email },
  });
  return response.data;
};
