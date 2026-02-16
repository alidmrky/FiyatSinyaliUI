export enum HealthStatus {
  Healthy = 'Healthy',
  Degraded = 'Degraded',
  Unhealthy = 'Unhealthy'
}

export enum ScraperErrorType {
  ParseError = 'ParseError',
  Timeout = 'Timeout',
  RateLimited = 'RateLimited',
  NetworkError = 'NetworkError',
  SiteError = 'SiteError',
  Unknown = 'Unknown'
}

export enum ScraperLogStatus {
  Success = 'Success',
  Error = 'Error',
  Fatal = 'Fatal'
}

export interface ScraperHealthCheck {
  id: string
  siteName: string
  status: HealthStatus
  isCircuitBreakerOpen: boolean
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  successRate: number
  averageResponseTime: string
  lastSuccessfulScrapeAt?: string
  errorsByType: Record<string, number>
  consecutiveFailures: number
  circuitBreakerOpenedAt?: string
  lastCheckedAt: string
  createdAt: string
  updatedAt: string
}

export interface ScraperLog {
  id: string
  siteName: string
  scraperType: string
  url: string
  status: ScraperLogStatus
  errorType?: ScraperErrorType
  errorMessage?: string
  stackTrace?: string
  exceptionType?: string
  httpStatusCode?: number
  duration: string
  retryCount: number
  metadata: Record<string, any>
  startedAt: string
  completedAt?: string
  createdAt: string
}

export interface LogFilters {
  siteName?: string
  errorType?: ScraperErrorType
  from?: string
  to?: string
}

export interface UnknownError {
  exceptionType: string
  count: number
  samples: Array<{
    siteName: string
    url: string
    errorMessage: string
    createdAt: string
  }>
}

export interface DashboardStats {
  healthy: number
  degraded: number
  unhealthy: number
  circuitOpen: number
}
