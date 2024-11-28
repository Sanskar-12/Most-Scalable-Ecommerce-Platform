import {
  BarChartType,
  CartItemsType,
  OrderType,
  PieChartType,
  Product,
  ShippingInfoType,
  StatsType,
  User,
} from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

export type AllOrderResponseType = {
  success: boolean;
  orders: OrderType[];
};

export type OrderDetailResponseType = {
  success: boolean;
  order: OrderType;
};

export type MessageResponseType = {
  success: boolean;
  message: string;
};

export type LoginResponseType = {
  success: boolean;
  user: User;
  message: string;
};

export type GetAllUsersResponseType = {
  success: boolean;
  users: User[];
};

export type GetUserResponseType = {
  success: boolean;
  user: User;
};

export type GetLatestProductsType = {
  success: boolean;
  products: Product[];
};

export type CategoriesType = {
  success: boolean;
  categories: string[];
};

export type SearchResponseType = {
  success: boolean;
  products: Product[];
  totalPages: number;
};

export type NewProductType = {
  success: boolean;
  message: string;
};

export type UpdateProductType = {
  success: boolean;
  message: string;
};

export type DeleteProductType = {
  success: boolean;
  message: string;
};

export type ProductDetailType = {
  success: boolean;
  product: Product;
};

export type NewOrderRequestType = {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: CartItemsType[];
};

export type UpdateOrdeRequestType = {
  orderId: string;
  userId: string;
};

export type DeleteOrdeRequestType = {
  orderId: string;
  userId: string;
};

export type DeleteUserRequestType = {
  adminId: string;
  userId: string;
};

export type StatsResponseType = {
  success: boolean;
  stats: StatsType;
};

export type PieResponseType = {
  success: boolean;
  charts: PieChartType;
};

export type BarResponseType = {
  success: boolean;
  charts: BarChartType;
};
