"use server";

import { and, desc, eq, ilike, inArray, or, sql, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  products,
  productVariants,
  productImages,
  colors,
  sizes,
  genders,
  brands,
  categories,
} from "@/lib/db/schema";

export type ProductListParams = {
  search?: string;
  gender?: string[];
  color?: string[];
  size?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: "featured" | "latest" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
};

export type ProductListItem = {
  id: string;
  name: string;
  description: string;
  brandId: string | null;
  categoryId: string | null;
  genderId: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  minPrice: number | null;
  maxPrice: number | null;
  images: string[];
};

export async function getAllProducts(params: ProductListParams) {
  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.max(1, Math.min(24, Number(params.limit || 12)));
  const offset = (page - 1) * limit;

  const conditions = [] as any[];
  // Only published
  conditions.push(eq(products.isPublished, true));

  // Search
  if (params.search) {
    const q = `%${params.search}%`;
    conditions.push(or(ilike(products.name, q), ilike(products.description, q)));
  }

  // Gender by slug
  let genderJoinNeeded = false;
  if (params.gender && params.gender.length) {
    genderJoinNeeded = true;
  }

  // Variant-driven filters
  const variantFilters: any[] = [];
  if (params.color && params.color.length) {
    variantFilters.push(inArray(colors.slug, params.color));
  }
  if (params.size && params.size.length) {
    variantFilters.push(inArray(sizes.name, params.size));
  }
  // Prices stored in USD in seed; UI filters are INR. Convert INR -> USD for comparisons.
  const INR_PER_USD = 83;
  if (params.priceMin !== undefined || params.priceMax !== undefined) {
    const priced = sql`COALESCE(${productVariants.salePrice}, ${productVariants.price})::numeric`;
    const minUsd = params.priceMin !== undefined ? Number(params.priceMin) / INR_PER_USD : undefined;
    const maxUsd = params.priceMax !== undefined ? Number(params.priceMax) / INR_PER_USD : undefined;
    if (minUsd !== undefined) variantFilters.push(sql`${priced} >= ${minUsd}`);
    if (maxUsd !== undefined) variantFilters.push(sql`${priced} <= ${maxUsd}`);
  }

  // Build base from and joins
  const base = db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      brandId: products.brandId,
      categoryId: products.categoryId,
      genderId: products.genderId,
      isPublished: products.isPublished,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      minPrice: sql<number>`MIN(COALESCE(${productVariants.salePrice}, ${productVariants.price})::numeric)`,
      maxPrice: sql<number>`MAX(COALESCE(${productVariants.salePrice}, ${productVariants.price})::numeric)`,
      images: sql<string[]>`ARRAY_REMOVE(ARRAY_AGG(${productImages.url} ORDER BY ${productImages.isPrimary} DESC, ${productImages.sortOrder} ASC), NULL)`,
    })
    .from(products)
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(productImages, eq(productImages.productId, products.id));

  // Apply optional joins for filters
  let query = base;
  if (genderJoinNeeded) {
    query = query.leftJoin(genders, eq(genders.id, products.genderId));
    conditions.push(inArray(genders.slug, params.gender!));
  }
  if (variantFilters.length) {
    query = query
      .leftJoin(colors, eq(colors.id, productVariants.colorId))
      .leftJoin(sizes, eq(sizes.id, productVariants.sizeId));
    conditions.push(and(...variantFilters));
  }

  const whereExpr = conditions.length ? and(...conditions) : undefined;

  // Total count (distinct products)
  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(DISTINCT ${products.id})` })
    .from(products)
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .leftJoin(genders, eq(genders.id, products.genderId))
    .where(whereExpr);

  // Sorting
  const sort = params.sortBy || "latest";
  const orderBy =
    sort === "price_asc"
      ? asc(sql`MIN(COALESCE(${productVariants.salePrice}, ${productVariants.price})::numeric)`)
      : sort === "price_desc"
      ? desc(sql`MAX(COALESCE(${productVariants.salePrice}, ${productVariants.price})::numeric)`)
      : desc(products.createdAt);

  // Data query with aggregation
  const rows = await query
    .where(whereExpr)
    .groupBy(
      products.id,
      products.name,
      products.description,
      products.brandId,
      products.categoryId,
      products.genderId,
      products.isPublished,
      products.createdAt,
      products.updatedAt
    )
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Map results
  const productsOut: ProductListItem[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    brandId: r.brandId,
    categoryId: r.categoryId,
    genderId: r.genderId,
    isPublished: r.isPublished,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    minPrice: (r as any).minPrice ?? null,
    maxPrice: (r as any).maxPrice ?? null,
    images: ((r as any).images || []) as string[],
  }));

  return { products: productsOut, totalCount: Number(count || 0) };
}

export async function getProduct(productId: string) {
  const priced = sql`COALESCE(${productVariants.salePrice}, ${productVariants.price})::numeric`;
  const [row] = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      brandId: products.brandId,
      categoryId: products.categoryId,
      genderId: products.genderId,
      isPublished: products.isPublished,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      images: sql<string[]>`ARRAY_REMOVE(ARRAY_AGG(${productImages.url} ORDER BY ${productImages.isPrimary} DESC, ${productImages.sortOrder} ASC), NULL)`,
      // Variant aggregates for quick PDP price bands
      minPrice: sql<number>`MIN(${priced})`,
      maxPrice: sql<number>`MAX(${priced})`,
    })
    .from(products)
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(eq(products.id, productId))
    .groupBy(
      products.id,
      products.name,
      products.description,
      products.brandId,
      products.categoryId,
      products.genderId,
      products.isPublished,
      products.createdAt,
      products.updatedAt
    );

  if (!row) return null;

  // Fetch detailed variants in one query (ordered)
  const variants = await db
    .select({
      id: productVariants.id,
      sku: productVariants.sku,
      inStock: productVariants.inStock,
      colorId: productVariants.colorId,
      sizeId: productVariants.sizeId,
      price: productVariants.price,
      salePrice: productVariants.salePrice,
      weight: productVariants.weight,
      dimensions: productVariants.dimensions,
      colorSlug: colors.slug,
      colorName: colors.name,
      sizeName: sizes.name,
    })
    .from(productVariants)
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .where(eq(productVariants.productId, productId))
    .orderBy(asc(colors.name), asc(sizes.sortOrder));

  const images = ((row as any).images || []) as string[];

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    brandId: row.brandId,
    categoryId: row.categoryId,
    genderId: row.genderId,
    isPublished: row.isPublished,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    images,
    minPrice: (row as any).minPrice ?? null,
    maxPrice: (row as any).maxPrice ?? null,
    variants,
  };
}
