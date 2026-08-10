export const ApiEndpoints = {
    auth: {
        login: 'auth/login',
        signup: 'auth/signup',
        refresh: 'auth/refresh',
        forgotPassword: 'auth/forgot-password',
        resetPassword: 'auth/reset-password'
    },
    invitations: {
        base: 'invitations',
        accept: 'invitations/accept'
    },
    tenants: 'tenants',
    plans: 'plans',
    subscriptions: {
        current: 'subscriptions/current',
        changePlan: 'subscriptions/change-plan'
    },
    users: 'users',
} as const;