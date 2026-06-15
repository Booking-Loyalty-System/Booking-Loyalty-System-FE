import React, { useEffect, useState, useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '@/features/products/application/useAuth.ts';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

interface DecodedToken {
    exp: number;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
    role?: string;
    Role?: string;
    [key: string]: unknown;
}

const getValidUserRole = (accessToken: string | null, allowedRoles?: string[]): { isValid: boolean; roleInvalid?: boolean; isExpired?: boolean } => {
    if (!accessToken || accessToken === "undefined" || accessToken === "null") {
        return { isValid: false };
    }

    try {
        const decoded = jwtDecode<DecodedToken>(accessToken);

        if (decoded.exp * 1000 < Date.now()) {
            console.warn("ProtectedRoute: Access Token đã hết hạn!");
            return { isValid: false, isExpired: true };
        }

        const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role || decoded.Role;

        if (allowedRoles) {
            if (!userRole || !allowedRoles.includes(userRole)) {
                return { isValid: false, roleInvalid: true };
            }
        }

        return { isValid: true };
    } catch (error) {
        console.error("ProtectedRoute: Lỗi giải mã token:", error);
        return { isValid: false };
    }
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const { refreshToken: triggerRefresh } = useAuth();

    // 2. KHAI BÁO TOÀN BỘ HOOKS LÊN ĐẦU HÀM (Đúng luật React)
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshFailed, setRefreshFailed] = useState(false);
    const hasCalledRefresh = useRef(false);

    // 3. Đưa logic tính toán biến xuống dưới Hooks
    const { isValid, roleInvalid, isExpired } = getValidUserRole(accessToken, allowedRoles);

    // 4. Khai báo useEffect (Đã thêm triggerRefresh vào dependency để sạch lỗi ESLint)
    useEffect(() => {
        if (isExpired && refreshToken && !hasCalledRefresh.current) {
            hasCalledRefresh.current = true;
            setIsRefreshing(true);

            console.log("ProtectedRoute: Đang tiến hành gia hạn Token tự động...");
            triggerRefresh({ refreshToken })
                .then(() => {
                    console.log("ProtectedRoute: Gia hạn Token thành công!");
                    setIsRefreshing(false);
                })
                .catch((err) => {
                    console.error("ProtectedRoute: Gia hạn thất bại, token đã oẹo!", err);
                    setIsRefreshing(false);
                    setRefreshFailed(true);
                });
        }
    }, [isExpired, refreshToken, refreshFailed, triggerRefresh]);

    // 5. BƯỚC CUỐI CÙNG: MỚI ĐƯỢC PHÉP CHẠY CÁC ĐIỀU KIỆN RETURN GIAO DIỆN

    // Nếu không có cả 2 token -> Chưa đăng nhập -> Đá về login
    if (!accessToken && !refreshToken) {
        return <Navigate to="/login" replace />;
    }

    // Đang gọi API ngầm -> Giữ chân người dùng ở màn hình chờ
    if (isRefreshing) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
                <h3>Đang đồng bộ phiên đăng nhập...</h3>
                <p>Vui lòng đợi trong giây lát</p>
            </div>
        );
    }

    // Nếu token hợp lệ (hoặc vừa được cập nhật mới thành công) -> Cho qua
    if (isValid) {
        return <Outlet />;
    }

    // Sai quyền hạn -> Đi tới trang 403
    if (roleInvalid) {
        console.warn("ProtectedRoute: Sai quyền truy cập (403 Forbidden).");
        return <Navigate to="/unauthorized" replace />;
    }

    // Nếu API đổi token thất bại hoàn toàn mới sút về login
    if (refreshFailed) {
        return <Navigate to="/login" replace />;
    }

    // Phòng kịch bản token hết hạn cũ mà không có refresh token để cứu
    if (isExpired && !refreshToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};