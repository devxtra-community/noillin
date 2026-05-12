import { BrandProfile } from "../models/brand.model.js";

export const findBrandById = async (brandId: string) => {
  return BrandProfile.findById(brandId).lean();
};

export const findBrandByUserId = async (userId: string) => {
  return BrandProfile.findOne({ userId }).lean();
};