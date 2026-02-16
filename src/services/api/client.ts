import { env } from '@/config/env'
import type { BaseResponse, ApiError, Result } from '@/types'

/**
 * API request wrapper with error handling
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${env.apiBaseUrl}/${endpoint}`

    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        })

        if (!response.ok) {
            const error: ApiError = {
                message: `HTTP error! status: ${response.status}`,
                statusCode: response.status,
            }
            throw error
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('API request failed:', error)
        throw error
    }
}

/**
 * Unwrap BaseResponse and return data
 */
export async function apiRequestWithUnwrap<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await apiRequest<BaseResponse<T>>(endpoint, options)

    if (!response.IsSuccess) {
        const error: ApiError = {
            message: response.Message,
            statusCode: response.StatusCode,
            trackingNumber: response.TrackingNumber,
        }
        throw error
    }

    return response.Data
}

/**
 * Unwrap Result<T> and return data or throw error
 * Use this for endpoints that return Result<T> pattern from backend
 */
export async function apiRequestWithResult<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const result = await apiRequest<Result<T>>(endpoint, options)

    if (!result.isSuccess || !result.data) {
        const error: ApiError = {
            message: result.errorMessage || 'Unknown error',
            statusCode: result.errorCode || 500,
        }
        throw error
    }

    return result.data
}
