import { Router } from "express";

import mediaRoutes from "../routes/media.routes.js";

import userRoutes from "./users.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import gigRoutes from "./gigs.routes.js";
import availabilityRoutes from "./availability.routes.js";
import bookingRoutes from "./bookings.routes.js";
import orderRoutes from "./orders.routes.js";
import paymentRoutes from "./payments.routes.js";
import searchRoutes from "./search.routes.js";
import healthRoutes from "./health.routes.js";
import adminRoutes from "./admin.route.js"

const router:Router = Router()
router.use("/health", healthRoutes)
router.use("/auth", authRoutes)
router.use("/admin", adminRoutes)
router.use("/users", userRoutes)
router.use("/profile", profileRoutes)
router.use("/gigs", gigRoutes);
router.use("/availability", availabilityRoutes);
router.use("/bookings", bookingRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/search", searchRoutes);
router.use("/media", mediaRoutes);

export default router