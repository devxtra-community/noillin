import { logger } from "../utils/logger.js";

import { setupBrandIndex } from "./indexes/brand.index.js";
import { setupGigIndex } from "./indexes/gig.index.js";
import { setupInfluencerIndex } from "./indexes/influencer.index.js";

export const setupMeili=async ()=>{
    try {
        await Promise.all([
            setupBrandIndex(),
            setupGigIndex(),
            setupInfluencerIndex()
        ])
    logger.info("Meilisearch indexes configured successfully");

    } catch (error) {
        logger.error("Meili setup failed",error)
        // process.exit(1); // prevent server from crashing during local dev if Meili is down
    }
}