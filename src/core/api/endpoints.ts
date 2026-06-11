export const ENDPOINTS = {
    PRODUCTS: {
        BASE: '/products',
        DETAIL: (id: string) => `/products/${id}`,
    },
    // Thêm các feature khác ở đây sau này...
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REGISTER: '/auth/register',
        REFRESH_TOKEN: '/auth/refresh-token',
        REGISTER_WITH_PHONE: '/auth/send-otp',
        REGISTER_WITH_PHONE_VERIFY: '/auth/verify-otp',
    },

    VEHICLES: {
        VEHICLE: '/vehicles'
    },

    WASH_PACKAGES: {
        WASH_PACKAGE: '/wash-packages',
        WASH_PACKAGE_DETAIL: (id: string) => `/wash-packages/${id}`
    },

    BOOKING:{
        BOOKING: '/bookings'
    },

    BRANCHES: {
        BASE: '/branches',
        SLOTS: (branchId: string, date: string) => `/branches/${branchId}/slots?date=${date}`,
    },

    LOYALTY: {
        INFO: '/loyalty/info',
        TRANSACTIONS: '/loyalty/transactions',
        REDEEM: '/loyalty/redeem',
    },

    STAFF: {
        DASHBOARD_STATS: '/staff/dashboard/stats',
        TODAY_BOOKINGS: '/staff/bookings/today',
        UPDATE_BOOKING_STATUS: (id: string, status: string) => `/staff/bookings/${id}/status?status=${status}`,
        CHECK_IN: (id: string) => `/staff/bookings/${id}/check-in`,
        COMPLETE_WASH: (id: string) => `/staff/bookings/${id}/complete-wash`,
    }
};