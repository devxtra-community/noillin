import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/users/users.routes.js";
import profileRoutes from "../modules/profile/profile.routes.js";
import gigRoutes from "../modules/gigs/gigs.routes.js";
import availabilityRoutes from "../modules/availability/availability.routes.js";
import bookingRoutes from "../modules/bookings/bookings.routes.js";
import orderRoutes from "../modules/orders/orders.routes.js";
import paymentRoutes from "../modules/payments/payments.routes.js";
import searchRoutes from "../modules/search/search.routes.js";

const router:Router = Router()
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