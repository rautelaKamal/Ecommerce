import { relations } from 'drizzle-orm';
import { colors } from '../schema/filters/colors';
import { productVariants } from '../schema/product-variants';

export const colorsRelations = relations(colors, ({ many }) => ({
  productVariants: many(productVariants),
}));
