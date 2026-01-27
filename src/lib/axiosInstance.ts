import axios, {type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse} from "axios";
import {fetchRefreshToken, TOKEN_REFRESH_PATH} from "../features/auth/services/api.ts";
import {logout} from "../features/auth/slice/authSlice.ts";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_EXCLUDED_PATHS: readonly string[] = [
    "/auth/login",
    "/auth/register",
    "/auth/logout",
];

interface FailedRequest {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let requestQueue: FailedRequest[] = [];

const processQueue = (error: unknown, response?: AxiosResponse | null) => {
  requestQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(response);
    }
  });
  requestQueue = [];
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const isExcluded: boolean = AUTH_EXCLUDED_PATHS.some((path: string) =>
        (originalRequest.url ?? "").includes(path)
    )

    if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !isExcluded &&
        !originalRequest.url?.includes(TOKEN_REFRESH_PATH)
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await fetchRefreshToken();
          isRefreshing = false;

          const res = await axiosInstance(originalRequest);
          processQueue(null, res);
          return res;
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError);
          const {store} = await import("../app/store");
          store.dispatch(logout());
          return Promise.reject(refreshError);
        }
      }

      return new Promise((resolve, reject) => {
        requestQueue.push({
          resolve: (response) => resolve(response),
          reject: (err: unknown) => reject(err),
        });
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
