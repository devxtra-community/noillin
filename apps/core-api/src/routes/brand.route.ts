import { Router } from "express";

import { getPublicBrandProfileController } from "../controllers/brand.controller.js";

const router: Router = Router();

router.get("/:brandId", getPublicBrandProfileController);

export default router;