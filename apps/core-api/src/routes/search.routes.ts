import { Router } from "express";

import { searchBrands, searchGigs, searchInfluencers } from "../controllers/search.controller.js";

const router: Router = Router();

router.get("/gigs",searchGigs);
router.get("/influencers", searchInfluencers);
router.get("/brands", searchBrands);



export default router