import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const notFound = (req:Request, res:Response) => {
    res.status(404).json({
        success: false,
        message: `Route not found ${req.method} ${req.originalUrl}`
    })
}

export const errorHandler = (err:any, req:Request, res: Response, next:NextFunction) => {
    const statusCode = err.statusCode || 500
    logger.error(`Error: ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    stack: err.stack,
})

res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
})
}

