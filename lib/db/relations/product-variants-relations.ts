import { relations } from 'drizzle-orm';
import { productVariants } from '../schema/product-variants';
import { products } from '../schema/products';
import { colors } from '../schema/filters/colors';
import { sizes } from '../schema/filters/sizes';
import { productImages } from '../schema/images';
import { cartItems } from '../schema/cart-items';
import { orderItems } from '../schema/order-items';

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  color: one(colors, {
    fields: [productVariants.colorId],
    references: [colors.id],
  }),
  size: one(sizes, {
    fields: [productVariants.sizeId],
    references: [sizes.id],
  }),
  images: many(productImages),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));
