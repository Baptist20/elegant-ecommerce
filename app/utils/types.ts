export type wishlist = {
  productId: string;
};

export type userType = {
  firstName: string;
  lastName: string;
  email?: string;
};

type item = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

enum statuses {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}
export type orders = [
  {
    items: item[];
    totalAmount: number;
    status: statuses;
    shippingAddress: {
      country: string;
      state: string;
      city: string;
      street: string;
      zipcode: string;
    };
  },
];
