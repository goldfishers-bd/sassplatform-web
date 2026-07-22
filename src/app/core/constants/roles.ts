export const Roles = {
    SuperAdmin: 'SuperAdmin',
    TenantAdmin: 'TenantAdmin'
} as const;

export type Role = typeof Roles[keyof typeof Roles];