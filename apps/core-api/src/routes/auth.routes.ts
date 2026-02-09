import { Router } from "express";

import { loginController, signupController } from "../controllers/auth.controller.js";

const router: Router = Router()
router.post("/login", loginController)
router.post("/signup", signupController);

export default router