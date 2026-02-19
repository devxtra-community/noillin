import { meili } from "../meili.js";

export const setupGigIndex=async () =>{
    const index=meili.index("gigs");

    await index.updateSettings({
        searchableAttributes:["title","category","tags","price","searchMeta"],
        filterableAttributes:["category","price","time"]
    })
}