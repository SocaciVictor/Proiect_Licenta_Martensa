import { PromotionDto } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";

export const fetchUserPromotions = async (
  userId: number
): Promise<PromotionDto[]> => {
  const res = await apiClient.get(`/promotions/user/${userId}`);
  return res.data;
};

export const fetchAllPromotions = async (): Promise<PromotionDto[]> => {
  const res = await apiClient.get("/promotions");
  return res.data;
};
