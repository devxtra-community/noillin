import { findBrandById, findBrandByUserId } from "../repositories/brand.repository.js";

export const getPublicBrandProfileService = async (brandId: string) => {

  let brand = await findBrandById(brandId);

  if (!brand) {
    brand = await findBrandByUserId(brandId);
  }

  if (!brand) {
    const error = Object.assign(new Error("Brand not found"), { statusCode: 404 });
    throw error;
  }

  return brand;
};