import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
// import { useState } from 'react';
import { AuthRepositoryImplement } from '../infrastructure/repositories/auth/auth.repository.implement.ts';
import type { User } from '../domain/models/auth/auth.model.ts';

export type LoginRequest = {
    email: string;
    password?: string; // Sửa lại từ 'password' sang optional nếu cần, hoặc giữ nguyên bắt buộc
};

const authRepository = new AuthRepositoryImplement();

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { data: user } = useQuery<User | null>({
        queryKey: ['current_user'],
        queryFn: () => {
            const savedUser = localStorage.getItem('user_info');
            return savedUser ? JSON.parse(savedUser) : null;
        },
        // Giữ cache vĩnh viễn, chỉ thay đổi khi ta chủ động set hoặc xóa
        staleTime: Infinity,
    });

    const isAuthenticated = !!user && !!localStorage.getItem('access_token');

    const loginMutation = useMutation({
        mutationFn: (credentials: Parameters<typeof authRepository.login>[0]) =>
            authRepository.login(credentials),
        onSuccess: (data) => {
            localStorage.setItem('access_token', data.accessToken);
            localStorage.setItem('user_info', JSON.stringify(data.user));

            // 💡 ĐỒNG BỘ NGAY LẬP TỨC: Ghi đè dữ liệu user mới vào Cache của React Query
            queryClient.setQueryData(['current_user'], data.user);
        },
    });

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');

        // 💡 Xóa dữ liệu user trong Cache về null
        queryClient.setQueryData(['current_user'], null);
        queryClient.clear();
    };

    return {
        user,
        isAuthenticated,
        isLoading: loginMutation.isPending,
        error: loginMutation.error,
        login: loginMutation.mutateAsync, // Dùng mutateAsync để presentation có thể await nếu muốn chuyển trang
        logout,
    };
};