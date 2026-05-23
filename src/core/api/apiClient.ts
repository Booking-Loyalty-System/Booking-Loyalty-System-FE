import axios from 'axios';

// Khởi tạo instance
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (Ví dụ: tự động gắn token)
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token'); // Hoặc lấy từ state management
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (Ví dụ: handle lỗi tập trung)
apiClient.interceptors.response.use(
    (response) => response.data, // Trả về thẳng data để tầng dưới đỡ phải .data
    (error) => {
        if (error.response?.status === 401) {
            // Handle logout hoặc refresh token ở đây
        }
        return Promise.reject(error);
    }
);