export interface OrderItemDto {
  productId: number;
  productName: string;
  price: number; // aici e price, nu pricePerUnit
  quantity: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  orderDate: string; // ISO date
  totalAmount: number;
  orderStatus: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber: string;
  items: OrderItemDto[];
}

export type OrderStatus =
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "SHIPPED"
  | "DELIVERED";
