import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

// Create axios instance
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Inject JWT token
axiosClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors
// Response interceptor - Handle errors
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if it's a login request
        const isLoginRequest = error.config?.url?.includes('/auth/login');

        // Auto-logout on 401 Unauthorized (ONLY if not logging in)
        if (error.response?.status === 401 && !isLoginRequest) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
