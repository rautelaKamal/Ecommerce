import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { baseSchema } from './enums';

// Genders table
export const genders = pgTable('genders', {
  ...baseSchema,
  name: text('name').notNull().unique(),
  code: text('code').notNull().unique(),
});

// Types
export type Gender = typeof genders.$inferSelect;
export type NewGender = typeof genders.$inferInsert;
