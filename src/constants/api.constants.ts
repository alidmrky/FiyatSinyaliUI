export const API_ENDPOINTS = {
    PRODUCTS: {
        LIST: 'api/products/list',
        GET: 'api/products/get',
        SEARCH: 'api/products/search',
    },
    SITES: {
        LIST: 'api/sites/list',
    },
    CATEGORIES: {
        LIST: 'api/categories/list',
    },
    AUTH: {
        REGISTER: 'api/auth/register',
        LOGIN: 'api/auth/login',
        LOGOUT: 'api/auth/logout',
        REFRESH_TOKEN: 'api/auth/refresh-token',
        PROFILE: 'api/auth/profile',
        UPDATE_PROFILE: 'api/auth/profile',
        CHANGE_PASSWORD: 'api/auth/change-password',
        FORGOT_PASSWORD: 'api/auth/forgot-password',
        RESET_PASSWORD: 'api/auth/reset-password',
        CONFIRM_EMAIL: 'api/auth/confirm-email',
    },
} as const
