// This file contains type definitions to avoid circular dependencies
import type { PgTable } from 'drizzle-orm/pg-core';

// Re-export common types
export * from './user';
export * from './categories';
export * from './brands';

// Define table types without actually creating tables
type InferSelect<T> = T extends PgTable<infer S> ? S : never;
type InferInsert<T> = T extends PgTable<infer S> ? Omit<S, 'id' | 'createdAt' | 'updatedAt'> & { id?: string, createdAt?: Date, updatedAt?: Date } : never;

// Product related types
export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string | null;
  genderId: string | null;
  brandId: string | null;
  isPublished: boolean;
  defaultVariantId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertProduct = Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Brand related types
export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  website: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertBrand = Omit<Brand, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Category related types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  imageUrl: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertCategory = Omit<Category, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// ProductVariant related types
export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  sizeId: string | null;
  colorId: string | null;
  price: number;
  salePrice: number | null;
  stock: number;
  isDefault: boolean;
  weight: number | null;
  length: number | null;
  width: number | null;
  height: number | null;
  barcode: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertProductVariant = Omit<ProductVariant, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Order related types
export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  shippingAddressId: string | null;
  billingAddressId: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertOrder = Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  orderNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// OrderItem related types
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  name: string;
  sku: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertOrderItem = Omit<OrderItem, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// Cart related types
export interface Cart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertCart = Omit<Cart, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

// CartItem related types
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export type InsertCartItem = Omit<CartItem, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
