import axios from 'axios';
import { AuthRepositoryImplement } from '@/features/products/infrastructure/repositories/auth/auth.repository.implement.ts';
import type { AuthResponseData } from "@/features/products/domain/models/auth/auth.model.ts";

// Khởi tạo instance
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
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

        if (config.headers) {
            config.headers['ngrok-skip-browser-warning'] = 'true';
        }
        // BÍ KÍP ĐA NGÔN NGỮ (i18n): Gắn ngôn ngữ hiện tại vào mọi request
        // Backend sẽ dùng Header này để trả về dữ liệu tương ứng (tiếng Việt hoặc Anh)
        const currentLang = localStorage.getItem('autowash-lang') || 'en';
        if (config.headers) {
            config.headers['Accept-Language'] = currentLang;
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

        // 🌟 FIX Ở ĐÂY: Kiểm tra xem URL bị lỗi có phải là API refresh token không
        const isRefreshRequest = originalRequest.url?.includes('refresh') || originalRequest.url?.includes('Refresh');

        // Thêm điều kiện !isRefreshRequest để chặn vòng lặp
        if (error.response?.status === 401 && !originalRequest._retry && !isRefreshRequest) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                handleForceLogout();
                return Promise.reject(error);
            }

            try {
                // Khởi tạo Repo (Lazy Loading)
                const authRepository = new AuthRepositoryImplement();
                const res = await authRepository.refreshToken({ refreshToken });

                const tokenData = (res as unknown as { data?: AuthResponseData })?.data || res;
                if (tokenData && tokenData.accessToken) {
                    localStorage.setItem('access_token', tokenData.accessToken);
                    if (tokenData.refreshToken) {
                        localStorage.setItem('refresh_token', tokenData.refreshToken);
                    }

                    originalRequest.headers.Authorization = `Bearer ${tokenData.accessToken}`;
                    originalRequest.headers['ngrok-skip-browser-warning'] = 'true';
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Bây giờ nếu gọi /refresh-token mà ra 401, nó sẽ nhảy thẳng vào đây!
                console.error("Token bốc mùi rồi, logout thôi:", refreshError);
                handleForceLogout();
                return Promise.reject(refreshError);
            }
        }

        // Bắt các lỗi khác hoặc lỗi 401 của chính API refresh-token
        return Promise.reject(error);
    }
);

const handleForceLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    // Không redirect nếu đang ở trang public (Landing, Login, Register)
    const publicPaths = ['/', '/login', '/register'];
    if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = '/login';
    }
};
