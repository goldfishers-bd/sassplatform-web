export const ApiEndpoints = {
    auth: {
        login: 'auth/login',
        signup: 'auth/signup',
        refresh: 'auth/refresh'
    },
    tenants: 'tenants',
    plans: 'plans',
    subscriptions: {
        current: 'subscriptions/current'
    }
} as const;