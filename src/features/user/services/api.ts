import type {UpdateUserPayloadDto, UserDetailsDto} from "../types";
import axiosInstance from "../../../lib/axiosInstance.ts";

const GET_USER_DETAILS_PATH = "/users/me-details";
const UPDATE_USER_DETAILS_PATH = "/users/update-user";
const UPDATE_USER_AVATAR_PATH = "/users/update-avatar";
const UPDATE_USER_EMAIL_PATH = "/users/update-email";


export const fetchUserDetails = async ():Promise<UserDetailsDto> => {
    const response = await axiosInstance.get(GET_USER_DETAILS_PATH);
    return response.data;
};

export const fetchUpdateUserDetails = async (payload: UpdateUserPayloadDto): Promise<UserDetailsDto> => {
    const response = await axiosInstance.patch(UPDATE_USER_DETAILS_PATH, payload);
    return response.data;
};

export const fetchUpdateUserAvatar = async (formData: FormData): Promise<UserDetailsDto> => {
    const response = await axiosInstance.patch(UPDATE_USER_AVATAR_PATH, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
};

export const fetchUpdateUserEmail = async (newEmail: string): Promise<UserDetailsDto> => {
    const response = await axiosInstance.patch(UPDATE_USER_EMAIL_PATH, {email: newEmail});
    return response.data;
};