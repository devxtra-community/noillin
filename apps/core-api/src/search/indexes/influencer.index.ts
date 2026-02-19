import { meili } from "../meili.js";

export const setupInfluencerIndex= async ()=>{
    const index=meili.index("influencers");

    await index.updateSettings({
        searchableAttributes:["fullName","username","instagram","youtube","category","location","languages","followersCount","engagementRate"],
        filterableAttributes:["category","language","folllowersCount","engagementRate"]
    })
}