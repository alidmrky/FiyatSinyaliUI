/**
 * Base response wrapper from API
 */
export interface BaseResponse<T> {
    IsSuccess: boolean
    Message: string
    StatusCode: number
    TrackingNumber: string
    Data: T
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
}

/**
 * Generic API error
 */
export interface ApiError {
    message: string
    statusCode: number
    trackingNumber?: string
}

/**
 * Represents the result of an operation with success/failure state and optional data
 * Mirrors the backend Result<T> class
 */
export interface Result<T> {
    isSuccess: boolean
    data?: T
    errorMessage?: string
    errorCode?: number
}

/**
 * Builder class for creating Result<T> instances
 * Provides static factory methods to match backend Result<T> pattern
 */
export class ResultBuilder {
    /**
     * Creates a successful result with data
     */
    static success<T>(data: T): Result<T> {
        return {
            isSuccess: true,
            data,
            errorMessage: undefined,
            errorCode: undefined
        }
    }

    /**
     * Creates a not found error result (404)
     */
    static notFound<T>(message: string): Result<T> {
        return {
            isSuccess: false,
            data: undefined,
            errorMessage: message,
            errorCode: 404
        }
    }

    /**
     * Creates a bad request error result (400)
     */
    static badRequest<T>(message: string): Result<T> {
        return {
            isSuccess: false,
            data: undefined,
            errorMessage: message,
            errorCode: 400
        }
    }

    /**
     * Creates an internal server error result (500)
     */
    static internalError<T>(message: string): Result<T> {
        return {
            isSuccess: false,
            data: undefined,
            errorMessage: message,
            errorCode: 500
        }
    }

    /**
     * Creates a custom error result with specific error code
     */
    static error<T>(message: string, errorCode: number): Result<T> {
        return {
            isSuccess: false,
            data: undefined,
            errorMessage: message,
            errorCode
        }
    }
}
