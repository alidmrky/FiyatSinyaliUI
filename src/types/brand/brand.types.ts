/**
 * Brand Management Type Definitions
 */

/**
 * Master Brand DTO
 */
export interface MasterBrand {
    id: string;
    code: string;
    name: string;
    normalizedName: string;
    logoUrl?: string;
    description?: string;
    isActive: boolean;
    isVerified: boolean;
    productCount: number;
    website?: string;
    countryCode?: string;
    createdAt: string;
    updatedAt?: string;
    alternatives?: BrandAlternative[];
}

/**
 * Brand Alternative DTO
 */
export interface BrandAlternative {
    id: string;
    masterBrandId: string;
    alternativeName: string;
    normalizedName: string;
    source?: string;
    usageCount: number;
    isAutoMatched: boolean;
    createdByUserId?: string;
    createdAt: string;
    masterBrand?: MasterBrand;
}

/**
 * Unmapped Brand DTO
 */
export interface UnmappedBrand {
    id: string;
    brandName: string;
    normalizedName: string;
    source?: string;
    productCount: number;
    firstSeenDate: string;
    lastSeenDate: string;
    status: UnmappedBrandStatus;
    suggestedMasterBrandId?: string;
    similarityScore?: number;
    resolvedByUserId?: string;
    resolvedDate?: string;
    notes?: string;
    suggestedMasterBrand?: MasterBrand;
}

/**
 * Unmapped Brand Status
 */
export type UnmappedBrandStatus = 'Pending' | 'Approved' | 'Rejected' | 'Ignored';

/**
 * Create Master Brand DTO
 */
export interface CreateMasterBrandDto {
    code: string;
    name: string;
    logoUrl?: string;
    description?: string;
    website?: string;
    countryCode?: string;
    isActive?: boolean;
    isVerified?: boolean;
}

/**
 * Update Master Brand DTO
 */
export interface UpdateMasterBrandDto {
    code?: string;
    name?: string;
    logoUrl?: string;
    description?: string;
    website?: string;
    countryCode?: string;
    isActive?: boolean;
    isVerified?: boolean;
}

/**
 * Create Brand Alternative DTO
 */
export interface CreateBrandAlternativeDto {
    masterBrandId: string;
    alternativeName: string;
    source?: string;
    isAutoMatched?: boolean;
}

/**
 * Master Brand Filter Request DTO
 */
export interface MasterBrandFilterRequest {
    searchTerm?: string;
    isActive?: boolean;
    isVerified?: boolean;
    minProductCount?: number;
    pageNumber: number;
    pageSize: number;
    sortBy?: 'name' | 'productcount' | 'createdat';
    sortDescending?: boolean;
}

/**
 * Unmapped Brand List Request DTO
 */
export interface UnmappedBrandListRequestDto {
    status?: UnmappedBrandStatus;
    source?: string;
    minProductCount?: number;
    pageNumber: number;
    pageSize: number;
    sortBy?: 'ProductCount' | 'FirstSeenDate' | 'LastSeenDate' | 'BrandName';
    sortDescending?: boolean;
}

/**
 * Resolve Unmapped Brand DTO
 */
export interface ResolveUnmappedBrandDto {
    action: UnmappedBrandAction;
    masterBrandId?: string;
    newMasterBrand?: CreateMasterBrandDto;
    notes?: string;
}

/**
 * Unmapped Brand Action
 */
export type UnmappedBrandAction = 'MapToExisting' | 'CreateNewMaster' | 'Ignore';

/**
 * Paginated Response
 */
export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}
