export const Roles = {
  ADMIN: "admin",
  INFLUENCER: "influencer",
  BRAND: "BRAND",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];
