export type User = {
  id: string;
  branches: string[];
  name: string;
  email: string;
  image: string;
  emailVerified:Date;
  session_expiry: string;
};

export type Customer = {
  id: string;
  name: string;
  name_en: string;
  email: string;
  image_url: string;
};

export type Brand = {
  documentId: string;
  name: string;
  brand_status: boolean;
}

export type Category = {
  documentId: string;
  name: string;
  category_status: boolean;
}

export type Product = {
  total: string | number | readonly string[] | undefined;
  documentId: string;
  name: string;
  quantity: number;
  price: number;
  brand: Brand;
  category: Category;
  image: any;
  product_status: boolean;
  code: string;
}

export type Order = {
  documentId: string;
  name: string;
  contact: string;
  amount: number;
  order_date: string;
  payment_type: string;
  payment_date: string;
  payment_status: boolean;
  order_products: Order_product[];
}

export type Order_product = {
  documentId: string;
  product: Product;
  order: Order;
  quantity: number;
  price: number;
  total: number;
}
