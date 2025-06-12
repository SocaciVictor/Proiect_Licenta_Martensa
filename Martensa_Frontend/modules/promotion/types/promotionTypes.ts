export enum PromotionType {
  ALL = "ALL",
  CUSTOM = "CUSTOM",
}

export type PromotionDto = {
  id: number;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  promotionType: PromotionType;
  productIds: number[];
  userIds: number[];
};

export type PromotionRequest = {
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  promotionType: PromotionType;
  productIds: number[];
  userIds: number[];
};
