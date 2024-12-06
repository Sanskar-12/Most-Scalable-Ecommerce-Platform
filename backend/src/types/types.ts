import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  photo: string;
  gender: string;
  _id: string;
  dob: Date;
}

export interface NewProductsRequestBody {
  name: string;
  price: number;
  stock: number;
  category: string;
  description: string;
}

export interface NewCouponRequestBody {
  coupon: string;
  amount: number;
}

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export type SearchRequestQuery = {
  search?: string;
  price?: string;
  category?: string;
  sort?: string;
  page?: string;
};

export interface BaseQueryType {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
}

export interface InvalidateCacheType {
  product?: boolean;
  order?: boolean;
  admin?: boolean;
  productId?: string | string[];
  orderId?: string;
  userId?: string;
  coupon?: boolean;
  couponId?: string;
}

type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export type OrderItemType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export interface NewOrderRequestBody {
  shippingInfo: ShippingInfoType;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  orderItems: OrderItemType[];
}
