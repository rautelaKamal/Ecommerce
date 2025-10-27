import { relations } from 'drizzle-orm';
import { sizes } from '../schema/filters/sizes';
import { productVariants } from '../schema/product-variants';

export const sizesRelations = relations(sizes, ({ many }) => ({
  productVariants: many(productVariants),
}));
