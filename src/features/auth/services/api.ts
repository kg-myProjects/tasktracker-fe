import axiosInstance from "../../../lib/axiosInstance";
import type {Credentials, UserCreateResponseDto, UserRegistrationDto, UserResponseDto} from "../types";
import axios from "axios";

// we already added  prefix /api in axios config

const LOGIN_PATH = "/auth/login";
const REGISTER_PATH = "/users/register";
const GET_CURRENT_USER_PATH = "/auth/me";
const LOGOUT_PATH = "/auth/logout";
export const TOKEN_REFRESH_PATH = "/api/v1/auth/refresh-token";


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

export const fetchRefreshToken = async ():Promise<void> => {
    await axios.post(TOKEN_REFRESH_PATH, {}, {withCredentials: true});
};