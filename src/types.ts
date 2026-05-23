export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  featured?: boolean;
  newArrival?: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  total_price: number;
  status: OrderStatus;
  notes?: string;
  items: OrderItem[];
  created_at: string;
}

export interface CartItem {
  id: string; // product_id + '_' + size + '_' + color
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}
