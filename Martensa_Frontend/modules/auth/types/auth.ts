// types/auth.ts

// 1. Matching cu DTO-ul Java din backend
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  dateOfBirth: string; // sau Date, dacă vrei să lucrezi direct cu obiecte Date
  roles?: string[]; // dacă backend-ul acceptă lista de roluri
}

// 2. Tip pentru request-ul de login
export interface LoginRequest {
  email: string;
  password: string;
}

// 3. Tip pentru răspunsul de autentificare
export interface AuthResponse {
  token: string; // token JWT sau alt tip de token
  refreshToken?: string; // dacă backend-ul returnează și un refresh token
}

export interface LoyaltyCardResponse {
  cardNumber: string;
  points: number;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  dateOfBirth: Date;
  loyaltyCard: LoyaltyCardResponse;
  roles: string[];
}

export interface UserSummaryResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface ProductDetailsResponse {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  barcode: string;
  ingredients: string;
  nutritionalValues: string;
  disclaimer: string;
  alcoholPercentage: number;
  categoryName: string;
}

export interface ProductRequest {
  name: string;
  description: string;
  brand: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  barcode: string;
  ingredients: string;
  nutritionalValues: string;
  disclaimer: string;
  alcoholPercentage: number;
  categoryId: number;
}

export interface StoreRequest {
  name: string;
  location: string;
  openingHours: string;
  contactNumber: string;
  managerName: string;
  availableServices: string;
}

export interface StoreResponse {
  id: number;
  name: string;
  location: string;
  openingHours: string;
  contactNumber: string;
  managerName: string;
  availableServices: string;
}

enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  orderDate: Date;
  totalAmount: number;
  orderStatus: OrderStatus;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string; // opțional, dacă este disponibil
  items: OrderItemDto[];
}

export interface OrderRequest {
  productsIds: number[];
  shippingAddress: string;
  paymentMethod: string;
}

enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface Payment {
  id: number;
  orderId: number;
  userId: number;
  amount: number;
  paymentStatus: PaymentStatus;
  method: string;
  paymentDate: Date;
}

export interface CategoryResponse {
  id: number;
  name: string;
}
