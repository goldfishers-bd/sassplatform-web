export interface Profile {
    id: string;
    email: string;
    displayName: string;
    role: string;
}

export interface UpdateProfileRequest {
    displayName: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}