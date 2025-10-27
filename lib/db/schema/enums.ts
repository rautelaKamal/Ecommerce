import { pgEnum, text, timestamp, uuid, integer, numeric, boolean, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Enums
export const addressTypeEnum = pgEnum('address_type', ['billing', 'shipping']);

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'stripe',
  'paypal',
  'cod',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'initiated',
  'completed',
  'failed',
]);

export const discountTypeEnum = pgEnum('discount_type', [
  'percentage',
  'fixed',
]);

// Re-export common types
export { numeric, text, integer, boolean, jsonb, sql };

// Base table with common fields
export const baseSchema = {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
};

export type BaseEntity = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

// Common column definitions
export const withTimestamps = {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
};

// Common constraints
export const withCheck = {
  quantity: () => integer('quantity').notNull().default(1),
  rating: () => integer('rating').notNull(),
  price: (precision = 10, scale = 2) => numeric('price', { precision, scale }).notNull(),
};
