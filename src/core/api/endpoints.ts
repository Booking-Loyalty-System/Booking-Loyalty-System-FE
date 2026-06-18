export const ENDPOINTS = {
    PRODUCTS: {
        BASE: '/products',
        DETAIL: (id: string) => `/products/${id}`,
    },
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
    ADMIN: {
        WASH_PACKAGES: '/admin/wash-packages',
        WASH_PACKAGE_DETAIL: (id: string) => `/admin/wash-packages/${id}`,
        BRANCHES: '/admin/branches',
        BRANCH_DETAIL: (id: string) => `/admin/branches/${id}`,
    },
    BOOKING: {
        BOOKING: '/bookings',
        MY_BOOKING: '/bookings/me',
        CANCEL: (id: string) => `/bookings/${id}/cancel`,
    },
    BRANCH: {
        BRANCH: '/branches',
        NEARBY: '/branches/nearby',
    },
    CUSTOMER: {
        ME: '/customers/me',
        UPDATE_PROFILE: '/customers/me',
    },
    STAFF: {
        BOOKINGS: '/staff/bookings',
        UPDATE_STATUS: (id: string) => `/staff/bookings/${id}/status`,
    },
    LOYALTY: {
        INFO: '/loyalty/info',
        TRANSACTIONS: '/loyalty/transactions',
        REDEEM: '/loyalty/redeem',
    },
    TIER: {
        TIER: '/tiers',
    },
    TIME_SLOT: {
        WEEK_SUMMARY: '/time-slots/week-summary',
    }
};
