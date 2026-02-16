import dayjs from 'dayjs'
import { DATE_FORMATS } from '@/constants'

/**
 * Format currency in Turkish Lira
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(amount)
}

/**
 * Format date using dayjs
 */
export const formatDate = (date: Date | string, format = DATE_FORMATS.DISPLAY): string => {
    return dayjs(date).format(format)
}

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
    return `%${value.toFixed(0)}`
}

/**
 * Format number with thousand separators
 */
export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('tr-TR').format(value)
}
