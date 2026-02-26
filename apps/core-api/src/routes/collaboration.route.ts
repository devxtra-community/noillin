import { Router } from "express";

import { inviteCollaboratorsController, respondToCollaborationController } from "../controllers/collaboration.controllers.js";
import { authenticate } from "../middlewares/auth.middleware.js";


const router:Router = Router();

/**
 * Invite collaborators to a gig
 */
router.post(
  "/gigs/:id/collaborators",
  authenticate,
  inviteCollaboratorsController
);

/**
 * Accept or reject collaboration
 */
router.patch(
  "/:id/respond",
  authenticate,
  respondToCollaborationController
);

export default router;