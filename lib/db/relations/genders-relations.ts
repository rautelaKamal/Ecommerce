import { relations } from 'drizzle-orm';
import { genders } from '../schema/filters/genders';
import { products } from '../schema/products';

export const gendersRelations = relations(genders, ({ many }) => ({
  products: many(products),
}));
