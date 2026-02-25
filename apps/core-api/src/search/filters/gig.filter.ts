export const buildGigFilters = (query: {niche?: string; minPrice?: number; maxPrice?: number}): string[] => {
  const filters: string[] = [];

  if (query.niche) {
    filters.push(`niche = "${query.niche}"`);
  }

  if (query.minPrice) {
    filters.push(`price >= ${Number(query.minPrice)}`);
  }

  if (query.maxPrice) {
    filters.push(`price <= ${Number(query.maxPrice)}`);
  }

  return filters;
};