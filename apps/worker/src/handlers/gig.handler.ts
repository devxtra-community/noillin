import { meili } from "../services/meili.service";
import { logger } from "../utils/logger";

interface GigCreatedPayload {
  gigId: string;
  title: string;
  category: string;          
  pricing: number;         
  influencerId: string;   
  createdAt: string | Date;
}

export async function handleGigCreated(data: GigCreatedPayload) {
  // Basic validation (important to avoid poison messages)
  if (!data.gigId || !data.title) {
    throw new Error("Invalid gig.created payload");
  }

  await meili.index("gigs").addDocuments([
    {
      id: data.gigId,
      title: data.title,
      category: data.category,        
      pricing: data.pricing,
      influencerId: data.influencerId,
      createdAt: data.createdAt,
    },
  ]);

  logger.info(`Indexed gig ${data.gigId} into Meilisearch`);
}