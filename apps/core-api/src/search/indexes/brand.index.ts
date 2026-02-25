import { meili } from "../meili.js";

export const setupBrandIndex=async ()=>{
    const index=meili.index("brands");

    await index.updateSettings({
        searchableAttributes:["companyName","industry"],
        filterableAttributes:["industry"]
    })
}