import { Router } from "express";

import { generateUploadUrlController } from "../controllers/media.controller.js";

const router: Router = Router();

router.post(
  "/upload-url",
  generateUploadUrlController
);

export default router;
