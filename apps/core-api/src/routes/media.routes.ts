import { Router } from "express";

import { generateUploadUrlController } from "../controllers/media.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router:Router = Router();

router.post(
  "/upload-url",
  authenticate,
  generateUploadUrlController
);

export default router;
