import { MeiliSearch } from "meilisearch";

import { logger } from "../utils/logger.js";

const host = process.env.MEILI_HOST;

if (!host) {
  throw new Error("MEILI_HOST is not defined in environment variables");
}

const config: { host: string; apiKey?: string } = { host };

if (process.env.MEILI_KEY) {
  config.apiKey = process.env.MEILI_KEY;
}

export const meili = new MeiliSearch(config);

logger.info("Meilisearch client initialized");
