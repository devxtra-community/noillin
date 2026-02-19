import { meili } from "../meili.js";

export const searchIndex = async (
  indexName: string,
  query: string,
  options: { limit?: number; offset?: number; filters?: string[] }
) => {
  const index = meili.index(indexName);
  return await index.search(query || "", options);
};
