import axiosInstance from "../../../lib/axiosInstance";
import type {Credentials, UserCreateResponseDto, UserRegistrationDto, UserResponseDto} from "../types";
//import axios from "axios";

// we already added  prefix /api in axios config

const LOGIN_PATH = "/auth/login";
const REGISTER_PATH = "/users/register";
const GET_CURRENT_USER_PATH = "/users/me";
const LOGOUT_PATH = "/auth/logout";
const UPDATE_USER_PATH = "/users/me";
export const TOKEN_REFRESH_PATH = "/auth/refresh-token";



export const updateUserData = async (nickname: string): Promise<UserResponseDto> => {
    const response = await axiosInstance.put(UPDATE_USER_PATH, {nickname});
    return response.data;
};

interface ResetPasswordData {
    token: string;
    newPassword: string;
}

interface ApiError extends Error {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export const fetchLogin = async (credentials: Credentials):Promise<void> => {
  await axiosInstance.post(LOGIN_PATH, credentials);
};

export const fetchLogout = async ():Promise<void> => {
    await axiosInstance.post(LOGOUT_PATH);
};

export const fetchRegister = async (dto: UserRegistrationDto):Promise<UserCreateResponseDto> => {
  const res = await axiosInstance.post(REGISTER_PATH, dto);
  return res.data;
};

export const fetchCurrentUser = async ():Promise<UserResponseDto> => {
    const res = await axiosInstance.get(GET_CURRENT_USER_PATH);
    return res.data;
};

export const fetchForgotPassword = async (email: string) => {
    await axiosInstance.post("/auth/forgot-password", { email });
};

export const fetchResetPassword = async (data: ResetPasswordData) => {
    try {
        await axiosInstance.post("/auth/reset-password", data);
    } catch (err) {
        const error = err as ApiError;
        const message = error.response?.data?.message ?? "Reset password failed";
        throw new Error(message);
    }
};

export const fetchRefreshToken = async ():Promise<void> => {
    await axiosInstance.post(TOKEN_REFRESH_PATH);
};

export const uploadAvatar =async (formData: FormData): Promise<UserResponseDto> => {
    const res = await axiosInstance.post("/users/avatar", formData);
        return res.data;
}