import { BrandProfile } from "../models/brand.model.js";
import type { IBrandProfile } from "../models/brand.model.js"
import { InfluencerProfile} from "../models/influencer.model.js";
import type { IInfluencerProfile } from "../models/influencer.model.js"

export class ProfileRepository {

  async findInfluencerByUserId(userId: string): Promise<IInfluencerProfile | null> {
    return InfluencerProfile.findOne({ userId });
  }

  async findBrandByUserId(userId: string): Promise<IBrandProfile | null> {
    return BrandProfile.findOne({ userId });
  }

  async createInfluencer(
    data: Partial<IInfluencerProfile>
  ): Promise<IInfluencerProfile> {
    return InfluencerProfile.create(data);
  }

  async createBrand(
    data: Partial<IBrandProfile>
  ): Promise<IBrandProfile> {
    return BrandProfile.create(data);
  }

  async updateInfluencer(
    userId: string,
    data: Partial<IInfluencerProfile>
  ): Promise<IInfluencerProfile | null> {
    return InfluencerProfile.findOneAndUpdate(
      { userId },
      data,
      { new: true }
    );
  }

  async updateBrand(
    userId: string,
    data: Partial<IBrandProfile>
  ): Promise<IBrandProfile | null> {
    return BrandProfile.findOneAndUpdate(
      { userId },
      data,
      { new: true }
    );
  }
}

export const profileRepository = new ProfileRepository();
