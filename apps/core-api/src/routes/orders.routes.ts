import { Router } from "express";
import { approveWork, markCompleted, releasePayment } from "src/controllers/order.controller.js";

import { createOrderService } from "../services/order.service.js";

const router: Router = Router();

router.post("/", async (req, res) => {
  const result = await createOrderService(req.body);
  res.json(result);
});
router.patch("/release/:id", releasePayment);
router.patch("/submit/:id", markCompleted);
router.patch("/approve/:id", approveWork);

export default router;