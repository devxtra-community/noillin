import { Router } from "express";

import { authenticate } from "../middlewares/auth.middleware.js";
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
  rejectGigController
} from "../controllers/admin.controller.js";

const router: Router = Router();

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
export default router;