import { Router } from "express";

import { getGigDetailsController, listGigsController } from "../controllers/gig.controller.js";


const router: Router = Router()

router.get("/", listGigsController);
router.get("/:id", getGigDetailsController);


export default router