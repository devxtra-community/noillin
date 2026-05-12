import { meili } from "../services/meili.service";
import { logger } from "../utils/logger.js";

export async function handleBrandCreated(data: { id: string; companyName?: string; industry?: string; contactPersonName?: string }) {
  if (!data.id) {
    throw new Error("Invalid brand.created payload");
  }

  await meili.index("brands").addDocuments([
    {
      id: data.id,
      companyName: data.companyName,
      industry: data.industry,
      contactPersonName: data.contactPersonName,
    },
  ]);

  logger.info(`Indexed brand ${data.id}`);
}