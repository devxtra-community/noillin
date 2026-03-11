import axios from 'axios';

import { useAuthStore } from '@/store/auth.store';


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    withCredentials: true, // Required to send cookies automatically!
    headers: {
        "Content-Type": "application/json"
    }
})


// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response Interceptor with token refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) 
        {
            if (isRefreshing) {
                // If already refreshing, queue this request
                
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Try to refresh the token
                // const response = await api.post("/auth/refresh");
                // const newAccessToken = response.data.data.accessToken;
                const response = await api.post("/auth/refresh");
                const { accessToken, user } = response.data.data;

                // useAuthStore.getState().setAuth(accessToken, user);

                // Save new access token in memory
                useAuthStore.getState().setAuth(accessToken, user);

                // Update authorization header
                api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Process queued requests
                processQueue(null, accessToken);

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear token and redirect to login
                processQueue(refreshError as Error, null);
                useAuthStore.getState().clearAuth();
                window.location.href = "/signup";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
)


export default api;