// This file contains type definitions to avoid circular dependencies

export interface BaseProduct {
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

export interface BaseBrand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
  website: string | null;
  createdAt: Date;
  updatedAt: Date;
}
