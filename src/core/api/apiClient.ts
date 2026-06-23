import axios from 'axios';
import { AuthRepositoryImplement } from '@/features/products/infrastructure/repositories/auth/auth.repository.implement.ts';
import type { AuthResponseData } from "@/features/products/domain/models/auth/auth.model.ts";

// Khởi tạo instance
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        const isRefreshRequest = config.url?.includes('refresh') || config.url?.includes('Refresh');
        if (token && config.headers && !isRefreshRequest) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                handleForceLogout();
                return Promise.reject(error);
            }

            try {
                // 🌟 BÍ KÍP Ở ĐÂY: Chỉ khởi tạo Repo khi THỰC SỰ dính lỗi 401 (Lazy Loading)
                // Lúc này toàn bộ file hệ thống đã lốt xong xuôi, gọi thoải mái không sợ chết
                const authRepository = new AuthRepositoryImplement();

                const res = await authRepository.refreshToken({ refreshToken });

                const tokenData = (res as unknown as { data?: AuthResponseData })?.data || res;
                if (tokenData && tokenData.accessToken) {
                    localStorage.setItem('access_token', tokenData.accessToken);
                    if (tokenData.refreshToken) {
                        localStorage.setItem('refresh_token', tokenData.refreshToken);
                    }

                    originalRequest.headers.Authorization = `Bearer ${tokenData.accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error("Token bốc mùi rồi, logout thôi:", refreshError);
                handleForceLogout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

const handleForceLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    if (window.location.pathname !== '/') {
        window.location.href = '/';
    }
};
