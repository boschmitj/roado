import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { error } from "console";

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.response.use(
    (response : AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log("Making reqest to refresh");
                await axios.post(
                    "http://localhost:8080/auth/refresh",
                    {},
                    { withCredentials: true } 
                );
                return api(originalRequest);

            } catch (refreshError) {
                console.warn("Refresh failed, redirecting to login");
                window.location.href = "/login";
            }
        
        }

        return Promise.reject(error);
    }
);

export default api;