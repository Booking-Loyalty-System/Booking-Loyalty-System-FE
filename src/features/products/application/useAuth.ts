import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { AuthRepositoryImplement } from '../infrastructure/repositories/auth/auth.repository.implement.ts';
import { AuthRepositoryMock } from '../infrastructure/repositories/auth/auth.repository.mock.ts';
import type {
    User,
    RefreshTokenRequest,
    RegisterRequest,
    PhoneRegisterRequest, AuthResponseData
} from '../domain/models/auth/auth.model.ts';
import {toast} from "sonner";

// Cờ useMock được cấu hình qua biến môi trường VITE_USE_MOCK (mặc định là false để chạy API thật)
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

const authRepository = useMock
    ? new AuthRepositoryMock()
    : new AuthRepositoryImplement();

export interface CleanedTokenData {
    userId: string | null;
    email: string | null;
    role: string | null;
    exp: number | null;
    iss: string | null;
    aud: string | null;
}

const decodeAndMapToken = (token: string | null): CleanedTokenData | null => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const decoded = JSON.parse(jsonPayload);

        // Map từ Claim của .NET sang Object thuần Frontend
        return {
            userId: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || null,
            email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || null,
            role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || null,
            exp: decoded.exp || null,
            iss: decoded.iss || null,
            aud: decoded.aud || null,
        };
    } catch (error) {
        console.error("Lỗi decode JWT token:", error);
        return null;
    }
};

export const useAuth = () => {
    const queryClient = useQueryClient();

    // Lấy thông tin user hiện tại từ cache/localStorage
    const { data: user } = useQuery<User | null>({
        queryKey: ['current_user'],
        queryFn: () => {
            const savedUser = localStorage.getItem('user_info');
            return savedUser ? JSON.parse(savedUser) : null;
        },
        staleTime: Infinity,
    });

    const { data: tokenData } = useQuery<CleanedTokenData | null>({
        queryKey: ['token_data'],
        queryFn: () => {
            const savedData = localStorage.getItem('token_data');
            return savedData ? JSON.parse(savedData) : null;
        },
        staleTime: Infinity,
    });

    const isAuthenticated = !!user && !!localStorage.getItem('access_token');

    const saveTokenData = (accessToken: string): CleanedTokenData | null => {
        const cleanedData = decodeAndMapToken(accessToken);
        if (cleanedData) {
            localStorage.setItem('token_data', JSON.stringify(cleanedData));
            queryClient.setQueryData(['token_data'], cleanedData);
        }
        return cleanedData;
    };

    const clearAuthData = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_info');
        localStorage.removeItem('token_data'); // 🌟 Xóa luôn cục dữ liệu sạch

        queryClient.setQueryData(['current_user'], null);
        queryClient.setQueryData(['token_data'], null); // 🌟 Xóa cache
        queryClient.clear();
    };

    // 1. Mutation: Login
    const loginMutation = useMutation({
        mutationFn: (credentials: Parameters<typeof authRepository.login>[0]) =>
            authRepository.login(credentials),
        onSuccess: (data) => {
            if (!data || !data.accessToken) {
                toast.error("Cấu trúc response login không hợp lệ:");
                return;
            }
            localStorage.setItem('access_token', data.accessToken);
            if (data.refreshToken) {
                localStorage.setItem('refresh_token', data.refreshToken);
            }
            const cleanedToken = saveTokenData(data.accessToken);
            if (cleanedToken) {
                const synthesizedUser: User = {
                    id: cleanedToken.userId || "",
                    email: cleanedToken.email || "",
                    role: cleanedToken.role || "",
                    // Điền thêm các trường mặc định nếu Model User ở Frontend ép buộc cần có
                } as unknown as User;

                localStorage.setItem('user_info', JSON.stringify(synthesizedUser));
                queryClient.setQueryData(['current_user'], synthesizedUser);
                return synthesizedUser;
            }
            return null;
        },
    });

    // 2. Mutation: Logout
    const logoutMutation = useMutation({
        mutationFn: () => authRepository.logout(),
        onSettled: () => {
            clearAuthData();
        }
    });

    // 3. Mutation: Refresh Token
    const refreshTokenMutation = useMutation({
        mutationFn: (data: RefreshTokenRequest) => authRepository.refreshToken(data),
        onSuccess: (res) => {
            const data = (res as unknown as { data?: AuthResponseData })?.data || res;
            // Cập nhật lại Access Token mới vào LocalStorage
            localStorage.setItem('access_token', data.accessToken);

            if (!data || !data.accessToken) {
                console.error("❌ Cấu trúc response Refresh Token không hợp lệ:", data);
                toast.error("Không thể tự động gia hạn phiên đăng nhập.");
                clearAuthData();
                return;
            }
            localStorage.setItem('access_token', data.accessToken);

            // Nếu API trả về cả Refresh Token mới thì cập nhật luôn, không thì thôi giữ cái cũ
            if (data.refreshToken) {
                localStorage.setItem('refresh_token', data.refreshToken);
            }

            saveTokenData(data.accessToken);
            // Cập nhật lại thông tin user trong cache nếu có thay đổi
            if (data.user) {
                localStorage.setItem('user_info', JSON.stringify(data.user));
                queryClient.setQueryData(['current_user'], data.user);
            }
        },
        onError: (error) => {
            console.error("Refresh token thất bại, tiến hành logout...", error);
            clearAuthData();
        }
    });

    // Mutation: Register
    const registerMutation = useMutation({
        mutationFn: (userData: RegisterRequest) => authRepository.register(userData),
        onSuccess: (data) => {
            // 1. Lưu token vào localStorage
            localStorage.setItem('access_token', data.accessToken);
            localStorage.setItem('refresh_token', data.refreshToken);

            saveTokenData(data.accessToken);
            console.log("Đăng ký thành công, Token đã lưu:", data);

            // 2. Chuyển hướng người dùng về trang chủ hoặc dashboard
            window.location.href = '/dashboard';
        },
        onError: (error) => {
            alert("Đăng ký thất bại: " + error.message);
        }
    });

    const registerWithPhoneMutation = useMutation({
        mutationFn: (userData: PhoneRegisterRequest) => authRepository.registerWithPhone(userData),
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.accessToken);
            if (data.refreshToken) {
                localStorage.setItem('refresh_token', data.refreshToken);
            }
            localStorage.setItem('user_info', JSON.stringify(data.user));
            saveTokenData(data.accessToken);
            queryClient.setQueryData(['current_user'], data.user);

            console.log("Đăng ký bằng SĐT thành công!");
            window.location.href = '/dashboard';
        },
        onError: (error) => {
            alert("Đăng ký bằng SĐT thất bại: " + error.message);
        }
    });



    return {
        user,
        userId: tokenData?.userId || null,
        email: tokenData?.email || null,
        role: tokenData?.role || null,
        tokenData,
        isAuthenticated,
        isLoading: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        isRefreshing: refreshTokenMutation.isPending,
        isPending: registerMutation.isPending,
        isPendingPhone: registerWithPhoneMutation.isPending,

        error: loginMutation.error || logoutMutation.error || refreshTokenMutation.error,

        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        refreshToken: refreshTokenMutation.mutateAsync,
        registerWithPhone: registerWithPhoneMutation.mutateAsync,
    };
};