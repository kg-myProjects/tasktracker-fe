export interface Credentials {
    email: string;
    password: string;
}

export interface UserRegistrationDto {
    email: string;
    password: string;
}

export type ROLE = "ROLE_USER" | "ROLE_ADMIN";
export type CONFIRM_STATUS = "CONFIRMED" | "UNCONFIRMED" | "BANNED";

export interface UserResponseDto {
    email: string;
    role: ROLE;
    confirmationStatus: CONFIRM_STATUS;
    avatarUrl: string | null;
    avatarUpdatedAt: number | null;
}

export interface UserCreateResponseDto {
    id: string;
    email: string;
    role: ROLE;
    confirmationResent: boolean;
}

export interface AuthSliceState {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user?: UserResponseDto;
    loginErrorMessage?: string;
    registerErrorMessage?: string;
}