import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor to add auth token (fallback if HttpOnly cookie fails for some reason)
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Interceptor to handle unauthorized errors (e.g. from single active session kick)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                // Use location.replace to prevent going back
                if (window.location.pathname !== '/login') {
                    window.location.replace('/login?error=session_expired');
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
