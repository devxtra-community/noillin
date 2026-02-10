export const Roles = {
  ADMIN: "admin",
  INFLUENCER: "influencer",
  BRAND: "brand",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
