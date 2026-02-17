import type { Response, NextFunction } from "express";

import {
    getMyProfileService,
    updateProfileService
} from "../services/profile.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";


export const getMyProfileController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const userId = req.user.userId;

        const profile = await getMyProfileService(userId);

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        next(error);
    }
};


export const updateProfileController = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const userId = req.user.userId;

        const profile = await updateProfileService(userId, req.body);

        res.status(200).json({
            success: true,
            data: profile
        });

    } catch (error) {
        next(error);
    }
};
