/**
 * Authentication-related type definitions
 */

/**
 * User login request
 */
export interface LoginDto {
    email: string;
    password: string;
    rememberMe?: boolean;
}

/**
 * User registration request
 */
export interface RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    birthDate?: string;
    acceptTerms: boolean;
}

/**
 * Authentication response
 */
export interface AuthResponseDto {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    accessToken: string;
    refreshToken: string;
    tokenExpiresAt: string;
    roles: string[];
    isEmailConfirmed: boolean;
    profilePictureUrl?: string;
}

/**
 * Token refresh request
 */
export interface RefreshTokenDto {
    accessToken: string;
    refreshToken: string;
}

/**
 * User profile data
 */
export interface UserProfileDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    birthDate?: string;
    isActive: boolean;
    isEmailConfirmed: boolean;
    profilePictureUrl?: string;
    createdAt: string;
    lastLoginAt?: string;
    roles: string[];
}

/**
 * Update profile request
 */
export interface UpdateUserProfileDto {
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    profilePictureUrl?: string;
}

/**
 * Change password request
 */
export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Forgot password request
 */
export interface ForgotPasswordDto {
    email: string;
}

/**
 * Reset password request
 */
export interface ResetPasswordDto {
    email: string;
    token: string;
    newPassword: string;
    confirmPassword: string;
}

/**
 * Stored auth data in localStorage
 */
export interface StoredAuthData {
    user: UserProfileDto;
    accessToken: string;
    refreshToken: string;
    tokenExpiresAt: string;
}
