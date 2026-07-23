import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { AuthRepositoryImplement } from '../infrastructure/repositories/auth/auth.repository.implement.ts';

import type {
    User,
    RefreshTokenRequest,
    RegisterRequest,
    VerifyEmailRequest,
    PhoneRegisterRequest, AuthResponseData,
    ChangePasswordRequest
} from '../domain/models/auth/auth.model.ts';
import { toast } from "sonner";

const authRepository = new AuthRepositoryImplement();

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
        onSuccess: (response) => {
            // 🌟 FIX Ở ĐÂY: Trích xuất đúng cục 'data' bên trong response của Backend
            const data = (response as any)?.data || response;

            if (!data || !data.accessToken) {
                toast.error("Cấu trúc response login không hợp lệ!");
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
                } as unknown as User;

                localStorage.setItem('user_info', JSON.stringify(synthesizedUser));
                queryClient.setQueryData(['current_user'], synthesizedUser);
                
                toast.success("Đăng nhập thành công!");
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

    // Mutation: Register (Bước 1 - chỉ nhận userId, chưa có token)
    const registerMutation = useMutation({
        mutationFn: (userData: RegisterRequest) => authRepository.register(userData),
        onSuccess: (userId) => {
            // API register chỉ trả về userId (string), lưu tạm để dùng cho bước verify
            console.log("Đăng ký thành công, userId:", userId);
        },
        onError: (error) => {
            console.error("Lỗi đăng ký:", error);
        }
    });

    // Mutation: Verify Email bằng OTP (Bước 2 - nhận token đầy đủ)
    const verifyEmailMutation = useMutation({
        mutationFn: (data: VerifyEmailRequest) => authRepository.verifyEmail(data),
        onSuccess: (data, variables) => {
            if (!data || !data.accessToken) {
                toast.error("Xác thực thất bại, vui lòng thử lại.");
                return;
            }
            // Lưu token vào localStorage sau khi xác thực OTP thành công
            localStorage.setItem('access_token', data.accessToken);
            if (data.refreshToken) {
                localStorage.setItem('refresh_token', data.refreshToken);
            }

            const cleanedToken = saveTokenData(data.accessToken);
            if (cleanedToken) {
                const synthesizedUser: User = {
                    id: cleanedToken.userId || variables.id || "",
                    email: cleanedToken.email || "",
                    role: cleanedToken.role || "Customer",
                    fullName: data.user?.fullName || "",
                } as unknown as User;

                localStorage.setItem('user_info', JSON.stringify(synthesizedUser));
                queryClient.setQueryData(['current_user'], synthesizedUser);
            }
            console.log("Xác thực email thành công, token đã lưu.");
        },
        onError: (error) => {
            console.error("Lỗi xác thực OTP:", error);
        }
    });

    const registerWithPhoneMutation = useMutation({
        mutationFn: (userData: PhoneRegisterRequest) => authRepository.registerWithPhone(userData),
        onSuccess: (data, variables) => {
            localStorage.setItem('access_token', data.accessToken);
            if (data.refreshToken) {
                localStorage.setItem('refresh_token', data.refreshToken);
            }
            const cleanedToken = saveTokenData(data.accessToken);
            if (cleanedToken) {
                const synthesizedUser: User = {
                    id: cleanedToken.userId || "",
                    email: cleanedToken.email || "",
                    role: cleanedToken.role || "Customer",
                    fullName: data.user?.fullName || variables.phoneNumber || "",
                } as unknown as User;

                localStorage.setItem('user_info', JSON.stringify(synthesizedUser));
                queryClient.setQueryData(['current_user'], synthesizedUser);
            }

            console.log("Đăng ký bằng SĐT thành công!");

        },
        onError: (error) => {
            console.error("Lỗi đăng ký SĐT:", error);
        }
    });

    const changePasswordMutation = useMutation({
        mutationFn: (data: ChangePasswordRequest) => authRepository.changePassword(data),
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
        isPendingVerify: verifyEmailMutation.isPending,
        isChangingPassword: changePasswordMutation.isPending,

        error: loginMutation.error || logoutMutation.error || refreshTokenMutation.error || changePasswordMutation.error,

        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        verifyEmail: verifyEmailMutation.mutateAsync,
        refreshToken: refreshTokenMutation.mutateAsync,
        registerWithPhone: registerWithPhoneMutation.mutateAsync,
        changePassword: changePasswordMutation.mutateAsync,
    };
};