export const Permissions = {
    CREATE_GIG : "create_gig",
    BOOK_GiG : "book_gig",
    VERIFY_USER : "verify_user",
    MANAGE_USER : "manage_user"
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions]
