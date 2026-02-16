export interface UserSliceState {
    data: UserDetailedDto | null;
    loading: boolean;
    error: string | undefined;
}

export interface UserDetailedDto {
    email: string;
    avatarUrl?: string;
    roles: string[];
    emailConfirmed: boolean;

    firstName?: string;
    lastName?: string;
    birthDate?: string;
    city?: string;
    phone?: string;
    about?: string;
}

export interface UpdateUserPayloadDto {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    city?: string;
    phone?: string;
    about?: string;
}