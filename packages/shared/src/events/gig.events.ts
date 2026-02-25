export const GIG_CREATED_EVENT = "gig.created";

export interface GigCreatedEvent {
  type: typeof GIG_CREATED_EVENT;
  data: {
    gigId: string;
    title: string;
    niche: string;
    price: number;
    influencerId: string;
    createdAt: string;
  };
}