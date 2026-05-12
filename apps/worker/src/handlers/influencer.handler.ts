import { meili } from "../services/meili.service";
import { logger } from "../utils/logger.js";

interface InfluencerCreatedPayload {
  id: string;
  fullName?: string;
  username: string;
  instagram?: string;
  youtube?: string;
  category?: string[];
  location?: string;
  languages?: string[];
  followersCount?: number;
  engagementRate?: number;
}

export async function handleInfluencerCreated(
  data: InfluencerCreatedPayload
) {
  if (!data.id) {
    throw new Error("Invalid influencer.created payload");
  }

  await meili.index("influencers").addDocuments([
    {
      id: data.id,
      fullName: data.fullName || "",
      username: data.username,
      instagram: data.instagram || "",
      youtube: data.youtube || "",
      category: data.category || [],
      location: data.location || "",
      languages: data.languages || [],
      followersCount: data.followersCount || 0,
      engagementRate: data.engagementRate || 0,
    },
  ]);

  logger.info(`Indexed influencer ${data.id} into Meilisearch`);
}