export type User = {
  name: string;
  email: string;
  photo: string;
  gender: string;
  role: string;
  _id: string;
  dob: string;
};

export type Product = {
  name: string;
  description: string;
  photos: {
    public_id: string;
    url: string;
  }[];
  price: number;
  stock: number;
  category: string;
  ratings: number;
  _id: string;
};

export type SearchProductRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};

export type NewProductRequest = {
  userId: string;
  formData: FormData;
};

export type UpdateProductRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type DeleteProductRequest = {
  userId: string;
  productId: string;
};

export type ShippingInfoType = {
  address: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
};

export type CartItemsType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
  stock: number;
};

export type OrderItemType = Omit<CartItemsType, "stock"> & { _id: string };

export type OrderType = {
  shippingInfo: ShippingInfoType;
  user: {
    _id: string;
    name: string;
  };
  status: "Processing" | "Shipped" | "Delivered";
  subtotal: number;
  discount: number;
  shippingCharges: number;
  tax: number;
  total: number;
  orderItems: OrderItemType[];
  _id: string;
};

type ChangePercentType = {
  revenue: number;
  products: number;
  users: number;
  orders: number;
};

type CountType = {
  totalRevenue: number;
  product: number;
  user: number;
  order: number;
};

type modifiedLatestTransactions = {
  _id: string;
  discount: number;
  amount: number;
  quantity: number;
  status: string;
};

export type StatsType = {
  changePercent: ChangePercentType;
  count: CountType;
  chart: {
    orderCountInaMonth: number[];
    ordersRevenueCountInaMonth: number[];
  };
  categoryCount: Record<string, number>[];
  userRatio: {
    male: number;
    female: number;
  };
  modifiedLatestTransactions: modifiedLatestTransactions[];
};

export type PieChartType = {
  orderFullfillment: {
    processing: number;
    shipped: number;
    delivered: number;
  };
  productCategories: Record<string, number>[];
  stockAvailability: {
    inStock: number;
    outOfStock: number;
  };
  revenueDistribution: {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
  };
  adminCustomers: {
    adminUsersCount: number;
    customerUsersCount: number;
  };
  usersAgeGroup: {
    teen: number;
    adult: number;
    old: number;
  };
};

export type BarChartType = {
  products: number[];
  users: number[];
  orders: number[];
};

export type LineChartType = {
  users: number[];
  products: number[];
  revenue: number[];
  discountAlloted: number[];
};

export type CouponType = {
  _id: string;
  coupon: string;
  amount: number;
};

export type UpdateCouponRequestType = {
  couponId: string;
  userId: string;
  formData: FormData;
};
