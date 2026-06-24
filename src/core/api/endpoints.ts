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
        REGISTER_WITH_PHONE: '/auth/verify-otp',
        CHANGE_PASSWORD: '/auth/change-password',
    },

    VEHICLES: {
        VEHICLE: '/vehicles'
    },

    WASH_PACKAGES: {
        WASH_PACKAGE: '/wash-packages',
        WASH_PACKAGE_DETAIL: (id: string) => `/wash-packages/${id}`
    },

    BOOKING: {
        BOOKING: '/bookings',
        MY_BOOKING: '/bookings/my-bookings',
        CANCEL: (id: string) => `/bookings/${id}/cancel`,
    },

    BRANCH: {
        BRANCH: '/admin/branches'
    },

    CUSTOMER: {
        ME: '/customers/me'
    },

    TIER: {
        TIER: '/tiers'
    },

    TIME_SLOT: {
        WEEK_SUMMARY: '/time-slots/weekly-summary'
    },

    STAFF: {
        BOOKINGS: '/staff/bookings',
    },

    LOYALTY: {
        BALANCE: '/loyalty/balance',
        HISTORY: '/loyalty/history',
        REDEEM: '/loyalty/redeem',
    },

    ADMIN: {
        WASH_PACKAGES: '/admin/wash-packages',
        WASH_PACKAGE_DETAIL: (id: string) => `/admin/wash-packages/${id}`,
        BRANCHES: '/admin/branches',
        BRANCH_DETAIL: (id: string) => `/admin/branches/${id}`,
    },

    PROMOTION: {
        BASE: '/promotions',
        VALIDATE: '/promotions/validate',
    },
};