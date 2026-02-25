import { MeiliSearch } from "meilisearch";

const host = process.env.MEILI_HOST;

if (!host) {
  throw new Error("MEILI_HOST not defined");
}

export const meili = new MeiliSearch({
  host,
  apiKey: process.env.MEILI_KEY,
});