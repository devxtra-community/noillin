import type { Response, NextFunction } from "express";

import { createReportService, updateReportStatusService, resolveReportService, getReportsService, getReportByIdService } from "../services/report.service.js";
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


export const updateReportStatusController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) throw new Error("Unauthorized");

        const { id } = req.params;

        if (typeof id !== "string") {
            throw new Error("Invalid report ID");
        }

        const report = await updateReportStatusService(
            req.user.userId,
            id
        );

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {
        next(error);
    }
};


//=============RESOLVE REPORT CONTROLLER=============

export const resolveReportController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.user) throw new Error("Unauthorized");

        const { id } = req.params;

        if (typeof id !== "string") {
            throw new Error("Invalid report ID");
        }

        const { resolution, adminNotes } = req.body;

        const report = await resolveReportService(
            req.user.userId,
            id,
            resolution,
            adminNotes
        );

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {
        next(error);
    }
}

//=============GET REPORTS CONTROLLER=============

export const getReportsController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { status, entityType } = req.query;

        const reports = await getReportsService({
            status: status as string,
            entityType: entityType as string
        });

        res.status(200).json({
            success: true,
            data: reports
        });

    } catch (error) {
        next(error);
    }
};

//=============GET REPORT BY ID CONTROLLER==============

export const getReportByIdController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (typeof id !== "string") {
            throw new Error("Invalid report ID");
        }

        const report = await getReportByIdService(id);

        res.status(200).json({
            success: true,
            data: report
        });

    } catch (error) {
        next(error);
    }
};