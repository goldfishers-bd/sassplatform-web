export interface Plan {
    id: string;
    name: string;
    description: string | null;
    price: number;
    billingCycle: 'Monthly' | 'Yearly';
    maxUsers: number;
    isActive: boolean;
}

export interface CreatePlanRequest {
    name: string;
    description?: string;
    price: number;
    billingCycle: 'Monthly' | 'Yearly';
    maxUsers: number;
}

export interface UpdatePlanRequest extends CreatePlanRequest {
    id: string;
    isActive: boolean;
}