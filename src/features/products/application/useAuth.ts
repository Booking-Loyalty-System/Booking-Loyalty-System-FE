import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { AuthRepositoryImplement } from '../infrastructure/repositories/auth/auth.repository.implement.ts';
import type {User, RefreshTokenRequest, RegisterRequest} from '../domain/models/auth/auth.model.ts';

const authRepository = new AuthRepositoryImplement();

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

    const isAuthenticated = !!user && !!localStorage.getItem('access_token');

    // 1. Mutation: Login
    const loginMutation = useMutation({
        mutationFn: (credentials: Parameters<typeof authRepository.login>[0]) =>
            authRepository.login(credentials),
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.accessToken);
            if (data.refreshToken) {
                localStorage.setItem('refresh_token', data.refreshToken); // 🌟 Lưu thêm refreshToken khi login
            }
            localStorage.setItem('user_info', JSON.stringify(data.user));

            queryClient.setQueryData(['current_user'], data.user);
        },
    });

    // 2. Mutation: Logout
    const logoutMutation = useMutation({
        mutationFn: () => authRepository.logout(),
        onSettled: () => {
            // Xóa sạch toàn bộ token và thông tin user
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token'); // 🌟 Xóa luôn cả refreshToken khi logout
            localStorage.removeItem('user_info');

            queryClient.setQueryData(['current_user'], null);
            queryClient.clear();
        }
    });

    // 3. Mutation: Refresh Token
    const refreshTokenMutation = useMutation({
        mutationFn: (data: RefreshTokenRequest) => authRepository.refreshToken(data),
        onSuccess: (data) => {
            // Cập nhật lại Access Token mới vào LocalStorage
            localStorage.setItem('access_token', data.accessToken);

            // Nếu API trả về cả Refresh Token mới thì cập nhật luôn, không thì thôi giữ cái cũ
            if (data.refreshToken) {
                localStorage.setItem('refresh_token', data.refreshToken);
            }

            // Cập nhật lại thông tin user trong cache nếu có thay đổi
            if (data.user) {
                localStorage.setItem('user_info', JSON.stringify(data.user));
                queryClient.setQueryData(['current_user'], data.user);
            }
        },
        onError: (error) => {
            console.error("Refresh token thất bại, tiến hành logout...", error);
            // Nếu refresh token cũng oẹo/hết hạn luôn thì tự động sút user ra ngoài
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_info');
            queryClient.setQueryData(['current_user'], null);
            queryClient.clear();
        }
    });

    // Mutation: Register
    const registerMutation = useMutation({
        mutationFn: (userData: RegisterRequest) => authRepository.register(userData),
        onSuccess: (data) => {
            // 1. Lưu token vào localStorage
            localStorage.setItem('access_token', data.accessToken);
            localStorage.setItem('refresh_token', data.refreshToken);

            console.log("Đăng ký thành công, Token đã lưu:", data);

            // 2. Chuyển hướng người dùng về trang chủ hoặc dashboard
            window.location.href = '/dashboard';
        },
        onError: (error) => {
            alert("Đăng ký thất bại: " + error.message);
        }
    });

    return {
        user,
        isAuthenticated,
        isLoading: loginMutation.isPending,
        isLoggingOut: logoutMutation.isPending,
        isRefreshing: refreshTokenMutation.isPending,
        isPending: registerMutation.isPending,
        error: loginMutation.error || logoutMutation.error || refreshTokenMutation.error,

        login: loginMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
        register: registerMutation.mutateAsync,
        refreshToken: refreshTokenMutation.mutateAsync,
    };
};