import type {CONFIRM_STATUS, ROLE} from "../../auth/types";

export interface UserSliceState {
    data: UserDetailsDto | null;
    loading: boolean;
    error: string | null;
}

export interface UserDetailsDto {
    email: string;
    role: ROLE;
    confirmationStatus: CONFIRM_STATUS;
    firstName: string | null;
    lastName: string | null;
    birthDate: string | null;
    city: string | null;
    phone: string | null;
    about: string | null;
    avatarUrl: string | null;
    avatarUpdatedAt: number | null;
}

export interface UpdateUserPayloadDto {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    city?: string;
    phone?: string;
    about?: string;
}

export interface UpdateAvatarResponseDto {
    avatarUrl: string | null;
    avatarUpdatedAt: number | null;
}