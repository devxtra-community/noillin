import { GigModel } from "../models/gig.model.js";
import type { GigDocument } from "../types/gig.type.js";

export const create_gig = async(
    data: Omit<GigDocument, "createdAt" | "updateAt" >
) => {
    return GigModel.create(data)
}