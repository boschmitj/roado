import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { error } from "console";

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

console.log("api axios instance created - registering response interceptor"); // debug
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        console.log("response interceptor fired"); // debug
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        console.log("Got response with status: " + error.response?.status);
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log("Making reqest to refresh");
                await axios.post(
                    "http://localhost:8080/auth/refresh",   //this isnt fired!!!
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