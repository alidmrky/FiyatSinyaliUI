import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/api/auth';
import type { UserProfileDto, LoginDto, RegisterDto } from '@/types/auth';

interface AuthContextType {
    user: UserProfileDto | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginDto) => Promise<void>;
    register: (data: RegisterDto) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    updateUserProfile: (data: Partial<UserProfileDto>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * AuthProvider - Manages authentication state globally
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserProfileDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state on mount
    useEffect(() => {
        initializeAuth();
    }, []);

    // Auto-refresh token before expiry
    useEffect(() => {
        if (!authService.isAuthenticated()) return;

        const checkTokenExpiry = setInterval(() => {
            if (authService.isTokenExpired()) {
                handleTokenRefresh();
            }
        }, 60000); // Check every minute

        return () => clearInterval(checkTokenExpiry);
    }, [user]);

    /**
     * Initialize authentication state from storage
     */
    const initializeAuth = async () => {
        try {
            const storedUser = authService.getCurrentUser();

            if (storedUser && authService.isAuthenticated()) {
                // Check if token is expired
                if (authService.isTokenExpired()) {
                    await handleTokenRefresh();
                } else {
                    setUser(storedUser);
                }
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            authService.clearAuthData();
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle token refresh
     */
    const handleTokenRefresh = async () => {
        try {
            const refreshedAuth = await authService.refreshToken();
            if (refreshedAuth) {
                setUser(authService.getCurrentUser());
            } else {
                // Refresh failed, logout user
                await logout();
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            await logout();
        }
    };

    /**
     * Login user
     */
    const login = async (credentials: LoginDto) => {
        console.log('🔐 [AuthContext] Login başladı...');
        const authData = await authService.login(credentials);
        console.log('✅ [AuthContext] Login response:', authData);
        const currentUser = authService.getCurrentUser();
        console.log('👤 [AuthContext] Current user from storage:', currentUser);
        setUser(currentUser);
        console.log('🎯 [AuthContext] User state güncellendi:', currentUser);
    };

    /**
     * Register new user
     */
    const register = async (data: RegisterDto) => {
        await authService.register(data);
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
    };

    /**
     * Logout user
     */
    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    /**
     * Refresh user data from API
     */
    const refreshUser = async () => {
        try {
            const profile = await authService.getProfile();
            setUser(profile);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    /**
     * Update user profile locally (optimistic update)
     */
    const updateUserProfile = (data: Partial<UserProfileDto>) => {
        if (!user) return;

        setUser({
            ...user,
            ...data,
        });
    };

    // Debug isAuthenticated calculation
    const isAuthenticatedValue = !!user && authService.isAuthenticated();

    React.useEffect(() => {
        console.log('🔐 [AuthContext] isAuthenticated değeri hesaplandı:', {
            user: user ? { firstName: user.firstName, email: user.email } : null,
            hasUser: !!user,
            serviceIsAuthenticated: authService.isAuthenticated(),
            finalIsAuthenticated: isAuthenticatedValue,
            accessToken: authService.getAccessToken(),
            storedAuthData: authService.getStoredAuthData()
        });
    }, [user, isAuthenticatedValue]);

    const value: AuthContextType = {
        user,
        isAuthenticated: isAuthenticatedValue,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
};
