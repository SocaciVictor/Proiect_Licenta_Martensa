import apiClient from "@/services/apiClient";

export interface MissingStock {
  productId: number;
  productName: string;
  message: string;
}

export const checkStoreStock = async (
  storeId: number,
  productIds: number[]
): Promise<MissingStock[]> => {
  const res = await apiClient.post(`/stores/${storeId}/stock/check`, {
    productIds,
  });
  return res.data;
};
