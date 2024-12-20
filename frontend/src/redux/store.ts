import { configureStore } from "@reduxjs/toolkit";
import { userAPI } from "./api/userAPI";
import { userSlice } from "./reducer/userSlice";
import { productAPI } from "./api/productAPI";
import { cartSlice } from "./reducer/cartSlice";
import { orderAPI } from "./api/orderAPI";
import { dashboardAPI } from "./api/dashboardAPI";
import { couponAPI } from "./api/couponAPI";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [productAPI.reducerPath]: productAPI.reducer,
    [orderAPI.reducerPath]: orderAPI.reducer,
    [dashboardAPI.reducerPath]: dashboardAPI.reducer,
    [couponAPI.reducerPath]: couponAPI.reducer,
    [userSlice.name]: userSlice.reducer,
    [cartSlice.name]: cartSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(userAPI.middleware)
      .prepend(productAPI.middleware)
      .prepend(orderAPI.middleware)
      .prepend(dashboardAPI.middleware)
      .prepend(couponAPI.middleware),
});
