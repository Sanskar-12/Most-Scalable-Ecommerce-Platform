import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartInitialStateType } from "../../types/reducer-types";
import { CartItemsType } from "../../types/types";

const initialState: CartInitialStateType = {
  loading: false,
  discount: 0,
  cartItems: [],
  shippingCharges: 0,
  shippingInfo: {
    address: "",
    city: "",
    country: "",
    pinCode: "",
    state: "",
  },
  subtotal: 0,
  tax: 0,
  total: 0,
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItemsType>) => {
      state.loading = true;
      // find the product in the orderItems
      const idx = state.cartItems.findIndex(
        (product) => product.productId === action.payload.productId
      );
      // if found then update the existing the product details
      if (idx !== -1) {
        state.cartItems[idx] = action.payload;
      }
      // if not then push directly
      else {
        state.cartItems.push(action.payload);
      }
      state.loading = false;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.loading = true;
      // filter out the product
      state.cartItems = state.cartItems.filter(
        (product) => product.productId !== action.payload
      );
      state.loading = false;
    },
    calculatePrice: (state) => {
      const subtotal = state.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      state.subtotal = subtotal;
      state.shippingCharges = state.subtotal > 1000 ? 0 : 200;
      state.tax = Math.round(state.subtotal * 0.18);
      state.total =
        state.subtotal + state.shippingCharges + state.tax - state.discount;
    },
    discountApplied: (state, action: PayloadAction<number>) => {
      state.discount = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, calculatePrice, discountApplied } =
  cartSlice.actions;
