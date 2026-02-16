import { apiRequest } from '../client';
import { API_ENDPOINTS } from '@/constants/api.constants';
import { STORAGE_KEYS } from '@/constants/storage.constants';
import { setItem, removeItem, getItem } from '@/utils/storage';
import type {
    LoginDto,
    RegisterDto,
    AuthResponseDto,
    RefreshTokenDto,
    UserProfileDto,
    UpdateUserProfileDto,
    ChangePasswordDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    StoredAuthData,
} from '@/types/auth';

/**
 * Auth service - Handles all authentication operations
 */
export const authService = {
    /**
     * Register a new user
     */
    async register(data: RegisterDto): Promise<AuthResponseDto> {
        // Backend returns AuthResponseDto directly, not wrapped in BaseResponse
        const authData = await apiRequest<AuthResponseDto>(
            API_ENDPOINTS.AUTH.REGISTER,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );

        console.log('📝 [authService] Register response:', authData);

        if (authData) {
            this.saveAuthData(authData);
        }

        return authData;
    },

    /**
     * Login with email and password
     */
    async login(data: LoginDto): Promise<AuthResponseDto> {
        // Backend returns AuthResponseDto directly, not wrapped in BaseResponse
        const authData = await apiRequest<AuthResponseDto>(
            API_ENDPOINTS.AUTH.LOGIN,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );

        console.log('🔑 [authService] Login API response:', authData);

        if (authData) {
            this.saveAuthData(authData);
        }

        return authData;
    },

    /**
     * Logout current user
     */
    async logout(): Promise<void> {
        try {
            await apiRequest<void>(API_ENDPOINTS.AUTH.LOGOUT, {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuthData();
        }
    },

    /**
     * Refresh access token
     */
    async refreshToken(): Promise<AuthResponseDto | null> {
        const storedData = this.getStoredAuthData();
        if (!storedData) {
            return null;
        }

        try {
            const refreshData: RefreshTokenDto = {
                accessToken: storedData.accessToken,
                refreshToken: storedData.refreshToken,
            };

            // Backend returns AuthResponseDto directly, not wrapped in BaseResponse
            const authData = await apiRequest<AuthResponseDto>(
                API_ENDPOINTS.AUTH.REFRESH_TOKEN,
                {
                    method: 'POST',
                    body: JSON.stringify(refreshData),
                }
            );

            if (authData) {
                this.saveAuthData(authData);
                return authData;
            }

            return null;
        } catch (error) {
            console.error('Token refresh error:', error);
            this.clearAuthData();
            return null;
        }
    },

    /**
     * Get current user profile
     */
    async getProfile(): Promise<UserProfileDto> {
        // Backend returns UserProfileDto directly, not wrapped in BaseResponse
        const profile = await apiRequest<UserProfileDto>(
            API_ENDPOINTS.AUTH.PROFILE
        );

        return profile;
    },

    /**
     * Update user profile
     */
    async updateProfile(data: UpdateUserProfileDto): Promise<UserProfileDto> {
        // Backend returns UserProfileDto directly, not wrapped in BaseResponse
        const updatedProfile = await apiRequest<UserProfileDto>(
            API_ENDPOINTS.AUTH.UPDATE_PROFILE,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            }
        );

        // Update stored user data
        const storedData = this.getStoredAuthData();
        if (storedData) {
            const newStoredData: StoredAuthData = {
                ...storedData,
                user: updatedProfile,
            };
            setItem(STORAGE_KEYS.AUTH_DATA, newStoredData);
        }

        return updatedProfile;
    },

    /**
     * Change password
     */
    async changePassword(data: ChangePasswordDto): Promise<void> {
        await apiRequest<void>(
            API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    },

    /**
     * Request password reset
     */
    async forgotPassword(data: ForgotPasswordDto): Promise<void> {
        await apiRequest<void>(
            API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    },

    /**
     * Reset password with token
     */
    async resetPassword(data: ResetPasswordDto): Promise<void> {
        await apiRequest<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    /**
     * Save auth data to localStorage
     */
    saveAuthData(authData: AuthResponseDto): void {
        console.log('💾 [authService] saveAuthData çağrıldı:', authData);

        const storedData: StoredAuthData = {
            user: {
                id: authData.userId,
                email: authData.email,
                firstName: authData.firstName,
                lastName: authData.lastName,
                fullName: authData.fullName,
                isActive: true,
                isEmailConfirmed: authData.isEmailConfirmed,
                profilePictureUrl: authData.profilePictureUrl,
                createdAt: new Date().toISOString(),
                roles: authData.roles,
            },
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
            tokenExpiresAt: authData.tokenExpiresAt,
        };

        console.log('📦 [authService] localStorage\'a kaydedilecek data:', storedData);

        setItem(STORAGE_KEYS.AUTH_DATA, storedData);
        setItem(STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
        setItem(STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);

        console.log('✅ [authService] localStorage\'a kaydedildi. Kontrol:', {
            authData: getItem(STORAGE_KEYS.AUTH_DATA),
            accessToken: getItem(STORAGE_KEYS.ACCESS_TOKEN)
        });
    },

    /**
     * Get stored auth data
     */
    getStoredAuthData(): StoredAuthData | null {
        return getItem<StoredAuthData>(STORAGE_KEYS.AUTH_DATA);
    },

    /**
     * Get access token
     */
    getAccessToken(): string | null {
        return getItem<string>(STORAGE_KEYS.ACCESS_TOKEN);
    },

    /**
     * Get refresh token
     */
    getRefreshToken(): string | null {
        return getItem<string>(STORAGE_KEYS.REFRESH_TOKEN);
    },

    /**
     * Clear all auth data
     */
    clearAuthData(): void {
        removeItem(STORAGE_KEYS.AUTH_DATA);
        removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        const authData = this.getStoredAuthData();
        return !!token && !!authData;
    },

    /**
     * Check if token is expired
     */
    isTokenExpired(): boolean {
        const authData = this.getStoredAuthData();
        if (!authData) return true;

        const expiresAt = new Date(authData.tokenExpiresAt);
        const now = new Date();

        // Add 1 minute buffer
        return expiresAt.getTime() - now.getTime() < 60000;
    },

    /**
     * Get current user
     */
    getCurrentUser(): UserProfileDto | null {
        const authData = this.getStoredAuthData();
        return authData?.user || null;
    },

    /**
      * Check if user has role
      */
    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user?.roles?.includes(role) || false;
    },

    /**
     * Check if user is admin
     */
    isAdmin(): boolean {
        return this.hasRole('Admin');
    },
};
