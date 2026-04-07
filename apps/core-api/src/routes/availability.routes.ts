// import { Router } from "express";

// import { authenticate, authorizePermission } from "../middlewares/auth.middleware.js";
// import { Permission } from "../rbac/permission.js";
// import { getAvailabilityController, setAvailabilityController } from "../controllers/availability.controller.js";

// const router: Router = Router();


// router.post(
//   "/",
//   authenticate,
//   authorizePermission(Permission.UPDATE_PROFILE),
//   setAvailabilityController
// );


// router.get(
//   "/:influencerProfileId",
//   getAvailabilityController
// );

// export default router;

import { Router } from "express";

import { AvailabilityController } from "../controllers/availability.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();
const controller = new AvailabilityController();

// Add leave
router.post("/unavailable", authenticate, controller.addUnavailable);

// Remove leave
router.delete("/unavailable", authenticate, controller.removeUnavailable);

// Check today
router.get("/check/:influencerId", controller.checkToday);

export default router;