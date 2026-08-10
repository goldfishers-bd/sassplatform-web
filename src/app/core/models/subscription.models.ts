export interface Subscription {
    id: string;
    tenantId: string;
    planId: string;
    status: string;
    startDate: string;
    endDate: string | null;
}

export interface ChangePlanRequest {
    newPlanId: string;
}