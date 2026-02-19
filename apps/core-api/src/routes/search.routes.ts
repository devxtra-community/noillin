import { Router } from "express";

import { searchGigs } from "../controllers/search.controller.js";

const router: Router = Router();

router.get("/gigs",searchGigs);



export default router