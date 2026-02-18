/**
 * Authentication Service - DUMMY IMPLEMENTATION
 * Uses mock data only, no real API calls
 */

import { ApiResponseOfObject } from '../../types/api/generic.ts';
import {
  ChangePasswordRequestDto,
  LoginDto,
  LoginResponse,
  RefreshTokenResponse,
  RegisterDto,
  ResetPasswordRequestDto,
} from '../../types/api/auth.types';
import { tokenStorage } from './tokenStorage';
import { apiRequest } from '../api/apiClient.ts';
import { API_ENDPOINTS } from '../api/endpoints.ts';

// Dummy user data
const DUMMY_USER = {
  id: 'demo-user-123',
  email: 'demo@example.com',
  firstName: 'Demo',
  lastName: 'User',
  roles: ['admin'],
  avatar: 'https://i.pravatar.cc/150?img=1',
  createdAt: new Date().toISOString(),
};

const DUMMY_TOKEN = 'dummy-jwt-token-mock-mode';

export const authService = {
  /**
   * Login with email and password - DUMMY IMPLEMENTATION
   * Accepts any credentials and returns dummy user
   */
  login: async (credentials: LoginDto): Promise<LoginResponse | undefined> => {
    const res = (await apiRequest.post(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )) as any;

    if (res.success) {
      const token = res.data.token;
      const user = res.data.user;

      const response: LoginResponse = {
        token: token,
        refreshToken: token,
        tokenType: 'Bearer',
        expiresIn: 3600,
        user: user,
      };
      tokenStorage.setTokens(response.token, response.refreshToken);
      tokenStorage.setUser(response.user);
      tokenStorage.setRolesAndPermissions(user.roleId);
      return response;
    }
    return;
  },

  /**
   * Register a new user - DUMMY IMPLEMENTATION
   */
  register: async (userData: RegisterDto): Promise<ApiResponseOfObject> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log(
      '[Auth Service - MOCK] Dummy registration with:',
      userData.email
    );

    return {
      success: true,
      message: 'Registration successful! You can now login.',
      data: DUMMY_USER,
    };
  },

  /**
   * Logout current user - DUMMY IMPLEMENTATION
   */
  logout: async (): Promise<void> => {
    console.log('[Auth Service - MOCK] Dummy logout');
    // Clear local storage
    tokenStorage.clearAuth();
  },

  /**
   * Refresh access token - DUMMY IMPLEMENTATION
   */
  refreshToken: async (): Promise<RefreshTokenResponse> => {
    console.log('[Auth Service - MOCK] Dummy token refresh');

    return {
      accessToken: DUMMY_TOKEN,
      refreshToken: DUMMY_TOKEN,
      expiresIn: 3600,
    };
  },

  /**
   * Request password reset email - DUMMY IMPLEMENTATION
   */
  forgotPassword: async (email: string): Promise<ApiResponseOfObject> => {
    console.log('[Auth Service - MOCK] Dummy forgot password for:', email);

    return {
      success: true,
      message: 'Password reset email sent (mock mode)',
      data: null,
    };
  },

  /**
   * Reset password with token - DUMMY IMPLEMENTATION
   */
  resetPassword: async (
    _data: ResetPasswordRequestDto
  ): Promise<ApiResponseOfObject> => {
    console.log('[Auth Service - MOCK] Dummy password reset');

    return {
      success: true,
      message: 'Password reset successful (mock mode)',
      data: null,
    };
  },

  /**
   * Change password for authenticated user - DUMMY IMPLEMENTATION
   */
  changePassword: async (
    _data: ChangePasswordRequestDto
  ): Promise<ApiResponseOfObject> => {
    console.log('[Auth Service - MOCK] Dummy password change');

    return {
      success: true,
      message: 'Password changed successfully (mock mode)',
      data: null,
    };
  },

  /**
   * Get current user from storage
   */
  getCurrentUser: () => {
    return tokenStorage.getUser();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return tokenStorage.isAuthenticated();
  },
};
