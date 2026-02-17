/**
 * Standard API Response wrapper
 * Matches backend BaseResponse<T> structure
 */
export interface BaseResponse<T> {
    isSuccess: boolean;
    message: string;
    statusCode: number;
    trackingNumber: string;
    data: T | null;
}

/**
 * API Error structure
 */
export interface ApiError {
    message: string;
    statusCode: number;
    trackingNumber?: string;
}

/**
 * Result<T> pattern from backend
 */
export interface Result<T> {
    isSuccess: boolean;
    data?: T;
    errorMessage?: string;
    errorCode?: number;
}
