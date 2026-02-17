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
    BRANDS: {
        LIST: 'api/masterbrands',
        GET: 'api/masterbrands',
        SEARCH: 'api/masterbrands/search',
        TOP: 'api/masterbrands/top',
        CREATE: 'api/masterbrands',
        UPDATE: 'api/masterbrands',
        DELETE: 'api/masterbrands',
        ADD_ALTERNATIVE: 'api/masterbrands',
    },
    UNMAPPED_BRANDS: {
        LIST: 'api/unmappedbrands/list',
        GET: 'api/unmappedbrands',
        PENDING_COUNT: 'api/unmappedbrands/pending-count',
        SUGGESTIONS: 'api/unmappedbrands',
        RESOLVE: 'api/unmappedbrands',
        BULK_IGNORE: 'api/unmappedbrands/bulk-ignore',
    },
    DASHBOARD: {
        STATS: 'api/dashboard/stats',
        MONGO_STATS: 'api/dashboard/mongo-stats',
        POSTGRE_STATS: 'api/dashboard/postgre-stats',
    },
} as const
