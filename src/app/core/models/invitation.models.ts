export interface Invitation {
    id: string;
    email: string;
    role: string;
    status: string;
    expiresAt: string;
}

export interface InviteUserRequest {
    email: string;
    role: string;
}