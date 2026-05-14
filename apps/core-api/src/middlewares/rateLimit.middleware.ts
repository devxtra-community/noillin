import { Request, Response, NextFunction } from 'express';
import { rateLimit, Options } from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
  handler: (req: Request, res: Response, next: NextFunction, options: Options) => {
    res.status(429).json(options.message);
  },
});
