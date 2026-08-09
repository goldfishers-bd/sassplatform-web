export interface Tenant {
    id: string;
    name: string;
    isActive: boolean;
    createdAt: string;
}

export interface CreateTenantRequest {
    name: string;
}

export interface UpdateTenantRequest {
    id: string;
    name: string;
    isActive: boolean;
}