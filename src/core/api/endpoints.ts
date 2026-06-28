export const ENDPOINTS = {
    NOTIFICATION: {
        BASE: '/notification',
        READ: (id: string) => `/notification/${id}/read`,
        UNREAD_COUNT: '/notification/unread-count'
    },

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
        CONFIRM: (id: string) => `/staff/bookings/${id}/confirm`,
        CHECK_IN: (id: string) => `staff/bookings/${id}/check-in`,
        QUEUE: (id: string) => `/staff/bookings/${id}/queue`,
        START: (id: string) => `/staff/bookings/${id}/start`,
        CHECKOUT: (id: string) => `/staff/bookings/${id}/checkout`,
        STAFF_CANCEL: (id: string) => `/staff/bookings/${id}/cancel`,
        NO_SHOW: (id: string) => `/staff/bookings/${id}/no-show`,
        COMPLETED: (id: string) => `/staff/bookings/${id}/completed`,
        QR: `/staff/bookings/scan-qr`,
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
        PROFILE: '/staff/profile',
        ID: (id: string) => `/staff/${id}`
    },

    LOYALTY: {
        BALANCE: '/loyalty/balance',
        HISTORY: '/loyalty/history',
    },

    ADMIN: {
        WASH_PACKAGES: '/admin/wash-packages',
        WASH_PACKAGE_DETAIL: (id: string) => `/admin/wash-packages/${id}`,
        BRANCHES: '/admin/branches',
        BRANCH_DETAIL: (id: string) => `/admin/branches/${id}`,
    // Promotions
        PROMOTIONS: '/admin/promotions',
        PROMOTION_DETAIL: (id: string) => `/admin/promotions/${id}`,

        // Add-ons
        ADD_ONS: '/admin/add-ons',
        ADD_ON_DETAIL: (id: string) => `/admin/add-ons/${id}`,

        // Bookings
        BOOKINGS_COMPLETE: (id: string) => `/admin/bookings/${id}/complete`,

        // Rewards
        REWARDS: '/admin/rewards',
        REWARD_DETAIL: (id: string) => `/admin/rewards/${id}`,
        REWARD_FULFILL: (id: string) => `/admin/rewards/redemptions/${id}/fulfill`,

        // Statistics
        STATISTICS: {
            OVERVIEW: '/admin/statistics/overview',
            REVENUE: '/admin/statistics/revenue',
            BOOKINGS: '/admin/statistics/bookings',
            TOP_CUSTOMERS: '/admin/statistics/top-customers',
            BRANCH_PERFORMANCE: '/admin/statistics/branch-performance',
            TIER_DISTRIBUTION: '/admin/statistics/tier-distribution',
        },

        // Tiers
        TIERS: '/admin/tiers',
        TIER_DETAIL: (id: string) => `/admin/tiers/${id}`,

        // Users
        USERS: '/admin/users',
        USER_STATUS: (id: string) => `/admin/users/${id}/status`,
        USER_ROLE: (id: string) => `/admin/users/${id}/role`,

        // Wash Bays
        WASH_BAYS: '/admin/wash-bays',
        WASH_BAY_DETAIL: (id: string) => `/admin/wash-bays/${id}`,
        WASH_BAY_BY_BRANCH: (id: string) => `/admin/wash-bays/by-branch/${id}`,
    },

    PROMOTION: {
        BASE: '/promotions',
        VALIDATE: '/promotions/validate',
    },
    REWARDS: {
        BASE: '/rewards',
        REWARD_DETAIL: (id: string) => `/rewards/${id}/redeem`,
        REDEMPTION_HISTORY: '/rewards/me/redemptions',
    },

    WASH_BAY: {
        BY_BRANCH: (id: string) => `/admin/wash-bays/by-branch/${id}`
    },

    PAYMENT: {
        BOOKINGS: (id: string) => `/payments/bookings/${id}/checkout`,
        IPN: "/payments/vnpay/ipn",
        RETURN: "/payments/vnpay/return",
        CREATE_PAY_OS_URL: (id: string) => `/payments/payos/${id}/create-link`
    }
};