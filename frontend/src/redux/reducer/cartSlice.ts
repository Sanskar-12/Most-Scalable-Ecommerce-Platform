import { createSlice } from "@reduxjs/toolkit";
import { CartInitialStateType } from "../../types/reducer-types";

const initialState: CartInitialStateType = {
  loading: true,
  discount: 0,
  orderItems: [],
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
  reducers: {},
});
