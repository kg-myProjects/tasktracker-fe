import axiosInstance from "../../../lib/axiosInstance";
import type {Credentials, TokenResponseDto} from "../types";

// we already added  prefix /api in axios config

const LOGIN_PATH = "/auth/login";
const REGISTER_PATH = "/users/register";
const GET_CURRENT_USER_PATH = "/auth/me";
const TOKEN_REFRESH_PATH = "/auth/refresh-token";


export const fetchLogin = async (credentials: Credentials) => {
  const res = await axiosInstance.post(LOGIN_PATH, credentials);
  return res.data;
};


export const fetchRegister = async (credentials: Credentials) => {
  const res = await axiosInstance.post(REGISTER_PATH, credentials);
  return res.data;
};

export const fetchCurrentUser = async () => {
    const res = await axiosInstance.get(GET_CURRENT_USER_PATH);
    return res.data;
}

export const fetchRefreshToken = async ():Promise<TokenResponseDto> => {
    const res = await axiosInstance.post(TOKEN_REFRESH_PATH);
    return res.data;
};