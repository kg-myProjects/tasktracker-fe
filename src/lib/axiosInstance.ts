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
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/reset-password/validate",
];

interface FailedRequest {
    resolve: (value: AxiosResponse) => void;
    reject: (error: unknown) => void;
    originalRequest: AxiosRequestConfig;
}

let isRefreshing = false;
let requestQueue: FailedRequest[] = [];

const processQueue = (error: unknown = null): void => {
    requestQueue.forEach(({resolve, reject, originalRequest}) => {
        if (error) {
            reject(error);
        } else {
            axiosInstance(originalRequest)
                .then(resolve)
                .catch(reject);
        }
    });
    requestQueue = [];
};

axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<AxiosResponse> => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        const isExcluded: boolean = AUTH_EXCLUDED_PATHS.some((path: string) =>
            (originalRequest.url ?? "").includes(path)
        );

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !isExcluded &&
            !originalRequest.url?.includes(TOKEN_REFRESH_PATH)
        ) {
            originalRequest._retry = true;


            if (!isRefreshing) {
                isRefreshing = true;

                fetchRefreshToken()
                    .then(() => {
                        isRefreshing = false;
                        processQueue();
                    })
                    .catch(async (refreshError) => {
                        isRefreshing = false;
                        processQueue(refreshError);
                        const {store} = await import("../app/store");
                        store.dispatch(logout());
                    });
            }
            return new Promise<AxiosResponse>((resolve, reject) => {
                requestQueue.push({resolve, reject, originalRequest});

            });
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
