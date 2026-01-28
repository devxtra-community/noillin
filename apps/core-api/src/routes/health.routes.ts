import { Router } from "express";

const router:Router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "core-api",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

export default router;
