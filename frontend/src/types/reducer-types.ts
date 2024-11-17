import { CartItemsType, ShippingInfoType, User } from "./types";

export interface UserInitialStateType {
  user: User | null;
  loading: boolean;
}

export interface CartInitialStateType {
  loading: boolean;
  shippingInfo: ShippingInfoType;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  cartItems: CartItemsType[];
}

export interface RootState {
  userSlice: UserInitialStateType;
}

export interface CartState {
  cartSlice: CartInitialStateType;
}
