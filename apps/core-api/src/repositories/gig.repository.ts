import { GigModel } from "../models/gig.model.js";
import type { GigDocument } from "../types/gig.type.js";

export const create_gig = async(
    data: Omit<GigDocument, "createdAt" | "updatedAt" >
) => {
    return GigModel.create(data)
}