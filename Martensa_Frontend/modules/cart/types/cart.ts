// modules/cart/types/cart.ts
export type CartProduct = {
  id: number;
  name: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  quantity: number;
};

export type CartResponse = {
  cartId: number;
  userId: number;
  products: CartProduct[];
  isEmpty: boolean;
  quantity: number;
};
