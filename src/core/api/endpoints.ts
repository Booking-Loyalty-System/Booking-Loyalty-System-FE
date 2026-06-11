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

    BRANCH:{
        BRANCH: '/admin/branches'
    }
};