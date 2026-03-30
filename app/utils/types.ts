export type ProductType = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  colors: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type wishlist = ProductType;

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
export type ordersType = {
  orderId: string;
  items: item[];
  totalAmount: number;
  status: statuses;
  shippingAddress: {
    country?: string;
    state?: string;
    city?: string;
    street?: string;
    zipcode?: string;
  };
  orderDate: Date;
};
