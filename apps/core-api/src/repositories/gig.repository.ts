import { GigModel } from "../models/gig.model.js";
import type { CreateGigDBInput } from "../types/gig.type.js";

export const create_gig = async (
  data: CreateGigDBInput
) => {
  return GigModel.create(data);
};