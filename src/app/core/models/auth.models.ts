export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    tenantName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    expiresAt: string;
    refreshToken: string;
}

export interface AcceptInviteRequest {
    token: string;
    password: string;
}