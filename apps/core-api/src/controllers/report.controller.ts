import type { Response, NextFunction } from "express";

import { createReportService } from "../services/report.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

export const createReportController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) throw new Error("Unauthorized");
        const report = await createReportService(req.user, req.body);

        res.status(201).json({
            success: true,
            data: report
        });
    } catch (error) {
        next(error);
    }
};