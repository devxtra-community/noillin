import { profileRepository } from "../repositories/profile.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import type { HttpError } from "../modules/auth/http-error.js";
import type { IInfluencerProfile } from "../models/influencer.model.js";
import type { IBrandProfile } from "../models/brand.model.js";
import { findGigsByInfluencer } from "../repositories/gig.repository.js";


export const getMyProfileService = async (userId: string) => {

    const user = await userRepository.findById(userId);

    if (!user) {
        const err: HttpError = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    if (user.role === "INFLUENCER") {

        const profile = await profileRepository.findInfluencerByUserId(userId);

        if (!profile) {
            const err: HttpError = new Error("Profile not found");
            err.statusCode = 404;
            throw err;
        }


        return profile;
    }

    if (user.role === "BRAND") {

        const profile = await profileRepository.findBrandByUserId(userId);

        if (!profile) {
            const err: HttpError = new Error("Profile not found");
            err.statusCode = 404;
            throw err;
        }


        return profile;
    }

    const err: HttpError = new Error("Invalid role");
    err.statusCode = 400;
    throw err;
};


export const updateProfileService = async (
    userId: string,
    data: unknown

) => {

    const user = await userRepository.findById(userId);
    if (!user) {
        const err: HttpError = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    if (user.role === "INFLUENCER") {
        return profileRepository.updateInfluencer(userId, data as Partial<IInfluencerProfile>);
    }

    if (user.role === "BRAND") {
        return profileRepository.updateBrand(userId, data as Partial<IBrandProfile>);
    }

    throw new Error("Invalid role");
};

export const getPublicInfluencerProfileService = async (influencerId: string) => {
    const profile = await profileRepository.findInfluencerById(influencerId);

    if (!profile) {
        const err: HttpError = new Error("Influencer profile not found");
        err.statusCode = 404;
        throw err;
    }

    const gigs = await findGigsByInfluencer(influencerId);

    return { profile, gigs };
};
