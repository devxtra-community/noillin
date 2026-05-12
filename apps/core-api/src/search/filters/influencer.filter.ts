export const buildInfluencerFilters = (query: {
  niche?: string;
  minFollowers?: number;
  maxFollowers?: number;
}) => {
  const filters: string[] = [];

  if (query.niche) {
    filters.push(`niche = "${query.niche}"`);
  }

  if (query.minFollowers) {
    filters.push(`followers >= ${Number(query.minFollowers)}`);
  }

  if (query.maxFollowers) {
    filters.push(`followers <= ${Number(query.maxFollowers)}`);
  }

  return filters;
};