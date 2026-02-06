import { Router } from "express";

import userRoutes from "../modules/users/users.routes.js";

import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import gigRoutes from "./gigs.routes.js";
import availabilityRoutes from "./availability.routes.js";
import bookingRoutes from "./bookings.routes.js";
import orderRoutes from "./orders.routes.js";
import paymentRoutes from "./payments.routes.js";
import searchRoutes from "./search.routes.js";
import healthRoutes from "./health.routes.js";

const router:Router = Router()
router.use("/health", healthRoutes)
router.use("/auth", authRoutes)
router.use("/users", userRoutes)
router.use("/profile", profileRoutes)
router.use("/gigs", gigRoutes);
router.use("/availability", availabilityRoutes);
router.use("/bookings", bookingRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/search", searchRoutes);

export default router