export enum HealthStatus {
  Healthy = 'Healthy',
  Degraded = 'Degraded',
  Unhealthy = 'Unhealthy'
}

export enum ScraperErrorType {
  // Network/HTTP (1-9)
  NetworkError = 1,
  Timeout = 2,
  RateLimited = 3,
  IpBlocked = 4,
  AuthenticationError = 5,
  SiteError = 6,

  // Parsing/Data (10-19)
  ParseError = 10,
  SiteStructureChanged = 11,
  MissingRequiredField = 12,
  InvalidDataFormat = 13,

  // Business Logic (20-29)
  ProductNotFound = 20,
  CategoryNotFound = 21,

  // Unknown/Other (99)
  Unknown = 99
}

export enum ScraperLogStatus {
  Success = 'Success',
  Warning = 'Warning',
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

// ─── ScrapTest ────────────────────────────────────────────────────────────────

/**
 * Request body for POST /api/ScrapTest
 */
export interface ScrapTestRequest {
  siteName: string
  productUrl: string
}

/**
 * Response from POST /api/ScrapTest
 */
export interface ScrapTestResult {
  /** Test edilen site adı */
  siteName: string
  /** Test edilen ürün URL'si */
  productUrl: string
  /** Scraper'dan gelen ham JSON (JSON-LD veya API response) */
  scrapResponseJson: string
  /** Ham JSON'un Product entity'sine dönüştürülmüş hali */
  mappedProduct?: MappedProduct
  /** Hata mesajı (sadece başarısız ise) */
  errorMessage?: string
  /** Scrape işlemi süresi (ms) */
  durationMs: number
}

/**
 * Scraper tarafından çekilen ürün verisi (backend Product entity)
 */
export interface MappedProduct {
  id?: string
  displayName?: string
  name?: string
  brandName?: string
  brandCode?: string
  color?: string
  colorCode?: string
  currentPrice?: number
  originalPrice?: number
  discount?: number
  imageUrl?: string
  siteCode?: string
  siteName?: string
  categoryName?: string
  categoryCode?: string
  externalId?: string
  productUrl?: string
  inStock?: boolean
  status?: string
  createdAt?: string
  updatedAt?: string
}
