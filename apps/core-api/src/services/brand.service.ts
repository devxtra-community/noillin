import { findBrandById} from "../repositories/brand.repository.js";

export const getPublicBrandProfileService = async (brandId: string) => {

  const brand = await findBrandById(brandId);

  if (!brand) {
    const error = Object.assign(new Error("Brand not found"), { statusCode: 404 });
    throw error;
  }

  // Only verified brands should be public
  if (!brand.isVerified) {
    const error = Object.assign(new Error("Brand profile not public"), { statusCode: 403 });
    throw error;
  }

  return brand;
};