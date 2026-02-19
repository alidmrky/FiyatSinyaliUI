/**
 * Color Management Type Definitions
 */

/**
 * Master Color DTO
 */
export interface MasterColor {
    id: string;
    code: string;
    name: string;
    normalizedName: string;
    hexCode?: string;
    description?: string;
    isActive: boolean;
    isVerified: boolean;
    productCount: number;
    createdAt: string;
    updatedAt?: string;
    alternatives?: ColorAlternative[];
}

/**
 * Color Alternative DTO
 */
export interface ColorAlternative {
    id: string;
    masterColorId: string;
    alternativeName: string;
    normalizedName: string;
    source?: string;
    usageCount: number;
    isAutoMatched: boolean;
    createdByUserId?: string;
    createdAt: string;
    masterColor?: MasterColor;
}

/**
 * Unmapped Color DTO
 */
export interface UnmappedColor {
    id: string;
    colorName: string;
    normalizedName: string;
    source?: string;
    productCount: number;
    firstSeenDate: string;
    lastSeenDate: string;
    status: UnmappedColorStatus;
    suggestedMasterColorId?: string;
    similarityScore?: number;
    resolvedByUserId?: string;
    resolvedDate?: string;
    notes?: string;
    suggestedMasterColor?: MasterColor;
}

/**
 * Unmapped Color Status
 */
export type UnmappedColorStatus = 'Pending' | 'Approved' | 'Rejected' | 'Ignored';

/**
 * Create Master Color DTO
 */
export interface CreateMasterColorDto {
    code: string;
    name: string;
    hexCode?: string;
    description?: string;
    isActive?: boolean;
    isVerified?: boolean;
}

/**
 * Update Master Color DTO
 */
export interface UpdateMasterColorDto {
    code?: string;
    name?: string;
    hexCode?: string;
    description?: string;
    isActive?: boolean;
    isVerified?: boolean;
}

/**
 * Create Color Alternative DTO
 */
export interface CreateColorAlternativeDto {
    masterColorId: string;
    alternativeName: string;
    source?: string;
    isAutoMatched?: boolean;
}

/**
 * Master Color Filter Request DTO
 */
export interface MasterColorFilterRequest {
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
 * Unmapped Color List Request DTO
 */
export interface UnmappedColorListRequestDto {
    status?: UnmappedColorStatus;
    source?: string;
    minProductCount?: number;
    pageNumber: number;
    pageSize: number;
    sortBy?: 'ProductCount' | 'FirstSeenDate' | 'LastSeenDate' | 'ColorName';
    sortDescending?: boolean;
}

/**
 * Resolve Unmapped Color DTO
 */
export interface ResolveUnmappedColorDto {
    action: UnmappedColorAction;
    masterColorId?: string;
    newMasterColor?: CreateMasterColorDto;
    notes?: string;
}

/**
 * Unmapped Color Action
 */
export type UnmappedColorAction = 'MapToExisting' | 'CreateNewMaster' | 'Ignore';
