import { PromotionDto, PromotionType } from "@/modules/auth/types/auth";
import apiClient from "@/services/apiClient";

export const getAllPromotions = async (): Promise<PromotionDto[]> => {
  const res = await apiClient.get<PromotionDto[]>("/promotions");
  return res.data;
};

export const createPromotion = async (data: {
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  promotionType: PromotionType;
  productIds: number[];
  userIds: number[];
}): Promise<void> => {
  await apiClient.post("/promotions", data);
};

export const deletePromotion = async (promotionId: number): Promise<void> => {
  await apiClient.delete(`/promotions/${promotionId}`);
};
