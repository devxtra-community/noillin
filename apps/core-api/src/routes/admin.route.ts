import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
import {
  updateReportStatusController,
  resolveReportController,
  getReportsController,
  getReportByIdController
} from "../controllers/report.controller.js";
import {
  approveSignupController,
  getAllpendingSignupController,
  rejectSignupController,
  getTotalUsersController,
  getTotalGigsController,
  getRecentActivityController,
  getGigModerationStatsController,
  pauseGigController,
  ignoreGigController,
  rejectGigController,
  getPlatformRevenueController
} from "../controllers/admin.controller.js";

const router: Router = Router();

router.get("/revenue", authenticate, getPlatformRevenueController);

router.get("/signup", getAllpendingSignupController);
router.post("/signup/approve", authenticate, approveSignupController);
router.post("/signup/reject", authenticate, rejectSignupController);
router.get("/total-users", authenticate, getTotalUsersController);
router.get("/total-gigs", authenticate, getTotalGigsController);
router.get("/recent-activity", authenticate, getRecentActivityController);
router.get("/gig-stats", authenticate, getGigModerationStatsController);
router.post("/gigs/:gigId/pause", authenticate, pauseGigController);
router.post("/gigs/:gigId/ignore", authenticate, ignoreGigController);
router.post("/gigs/:gigId/reject", authenticate, rejectGigController);

// Report Moderation
router.get("/reports", authenticate, getReportsController);
router.get("/reports/:id", authenticate, getReportByIdController);
router.patch("/reports/:id/status", authenticate, updateReportStatusController);
router.patch("/reports/:id/resolve", authenticate, resolveReportController);


export default router;