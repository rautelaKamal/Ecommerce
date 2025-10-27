// Auth schemas
export * from './account';
export * from './session';
export * from './verification';

// Core schemas
export * from './user';
export * from './addresses';
export * from './guest';

// Product related schemas
export { products, productsRelations, insertProductSchema, selectProductSchema } from './products';
export { productVariants, productVariantsRelations } from './product-variants';
export { productImages, productImagesRelations, insertProductImageSchema, selectProductImageSchema } from './images';
export { categories, categoriesRelations, insertCategorySchema, selectCategorySchema } from './categories';
export { collections, collectionsRelations, insertCollectionSchema, selectCollectionSchema } from './collections';
export { brands, brandsRelations, insertBrandSchema, selectBrandSchema } from './brands';

// Filter schemas
export { genders, gendersRelations, insertGenderSchema, selectGenderSchema } from './filters/genders';
export { sizes, sizesRelations, insertSizeSchema, selectSizeSchema } from './filters/sizes';
export { colors, colorsRelations, insertColorSchema, selectColorSchema } from './filters/colors';

// E-commerce schemas
export { carts, cartsRelations } from './carts';
export { cartItems, cartItemsRelations } from './cart-items';
export { orders, ordersRelations } from './orders';
export { orderItems, orderItemsRelations } from './order-items';
export { payments, paymentsRelations } from './payments';

// Other schemas
export { reviews, reviewsRelations } from './reviews';
export { wishlists, wishlistsRelations } from './wishlists';
export { coupons, couponsRelations } from './coupons';
export { productCollections, productCollectionsRelations } from './product-collections';

// Re-export types
export type { InsertProduct, SelectProduct } from './products';
export type { NewProductVariant as InsertVariant, ProductVariant as SelectVariant } from './product-variants';
export type { NewProductVariant as InsertProductVariant } from './product-variants';
export type { InsertProductImage, SelectProductImage } from './images';
export type { SelectGender } from './filters/genders';
export type { SelectColor } from './filters/colors';
export type { SelectSize } from './filters/sizes';
export type { InsertCategory, SelectCategory } from './categories';
export type { InsertCollection, SelectCollection } from './collections';

// Zod schemas for variants
export { insertVariantSchema, selectVariantSchema } from './product-variants';

// Enums and types
export * from './enums';

// Export db-types as the single source of truth for types
export * from './db-types';
