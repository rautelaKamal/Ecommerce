import { pgTable, uuid, numeric, timestamp, text } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { baseSchema, orderStatusEnum } from './enums';
import { users } from './user';
import { addresses } from './addresses';
import { orderItems } from './order-items';
import { payments } from './payments';

// Orders table
export const orders = pgTable('orders', {
  ...baseSchema,
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddressId: uuid('shipping_address_id').notNull().references(() => addresses.id),
  billingAddressId: uuid('billing_address_id').notNull().references(() => addresses.id),
  // Tracking information (can be null until shipped)
  trackingNumber: text('tracking_number'),
  shippingCarrier: text('shipping_carrier'),
});

// Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
  }),
  items: many(orderItems),
  payments: many(payments),
}));

// Types
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
