export const Roles = {
    SuperAdmin: 'SuperAdmin',
    TenantAdmin: 'TenantAdmin',
    Member: 'Member'
} as const;

export type Role = typeof Roles[keyof typeof Roles];