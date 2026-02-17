/**
 * Dashboard statistics types matching backend DTOs
 */

/**
 * MongoDB product statistics
 */
export interface MongoProductStats {
    pendingCount: number;
    publishedCount: number;
    failedCount: number;
    brandUnresolvedCount: number;
    completedCount: number;
    totalCount: number;
}

/**
 * Site product count
 */
export interface SiteProductCount {
    siteName: string;
    productCount: number;
}

/**
 * PostgreSQL product statistics
 */
export interface PostgreProductStats {
    totalCount: number;
    siteProductCounts: SiteProductCount[];
}

/**
 * Complete dashboard statistics
 */
export interface DashboardStats {
    mongoProductStats: MongoProductStats;
    postgreProductStats: PostgreProductStats;
}
