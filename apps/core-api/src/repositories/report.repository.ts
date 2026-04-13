import type { QueryFilter } from "mongoose";

import { ReportModel } from "../models/report.model.js";
import type { ReportDocument } from "../types/report.types.js";

export const createReportRepository = async (payload: Partial<ReportDocument>) => {
    return await ReportModel.create(payload);
};

export const findOneReportRepository = async (query: QueryFilter<ReportDocument>) => {
    return await ReportModel.findOne(query);
};