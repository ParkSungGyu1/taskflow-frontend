import { LoginRequest, LoginResponse, RegisterRequest, User } from '../types';
import { get, post } from './api';
import { mockAuthService } from './mockBackend';
import { getToken, setToken, removeToken, isValidToken } from '../utils/security';

// Use mock service for development until backend is ready
const useMock = true;

/**
 * Authenticate user and store token
 */
export const login = async (credentials: LoginRequest) => {
  try {
    if (useMock) {
      const response = await mockAuthService.login(credentials.username, credentials.password);
      if (response.success && response.data && response.data.token) {
        setToken(response.data.token);
      }
      return response;
    }

    const response = await post<LoginResponse>('/auth/login', credentials);
    if (response.success && response.data && response.data.token) {
      setToken(response.data.token);
    }
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: '로그인 처리 중 오류가 발생했습니다.',
      data: null,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Register new user
 */
export const register = async (userData: RegisterRequest) => {
  try {
    if (useMock) {
      return mockAuthService.register(userData);
    }
    return post<User>('/auth/register', userData);
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      message: '회원가입 처리 중 오류가 발생했습니다.',
      data: null,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Logout user and redirect to login page
 */
export const logout = () => {
  removeToken();
  
  // 로그아웃 시 원래 페이지로 돌아갈 수 있도록 현재 경로 저장
  const currentPath = window.location.pathname;
  if (currentPath !== '/login' && currentPath !== '/register') {
    sessionStorage.setItem('redirectAfterLogin', currentPath);
  }
  
  window.location.href = '/login';
};

/**
 * Get current user information
 */
export const getCurrentUser = async () => {
  try {
    if (useMock) {
      return mockAuthService.getCurrentUser();
    }
    return get<User>('/users/me');
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      message: '사용자 정보를 가져오는 중 오류가 발생했습니다.',
      data: null,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Get all users
 */
export const getUsers = async () => {
  try {
    if (useMock) {
      return mockAuthService.getUsers();
    }
    return get<User[]>('/users');
  } catch (error) {
    console.error('Get users error:', error);
    return {
      success: false,
      message: '사용자 목록을 가져오는 중 오류가 발생했습니다.',
      data: [],
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Update user information
 */
export const updateUser = async (id: number, userData: Partial<User>) => {
  try {
    if (useMock) {
      // Mock implementation could be added here
      return mockAuthService.updateUser?.(id, userData) || 
        { success: false, message: 'Not implemented', data: null, timestamp: new Date().toISOString() };
    }
    return post<User>(`/users/${id}`, userData);
  } catch (error) {
    console.error('Update user error:', error);
    return {
      success: false,
      message: '사용자 정보 업데이트 중 오류가 발생했습니다.',
      data: null,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  try {
    if (useMock) {
      // In mock mode, always consider authenticated if token exists
      return !!getToken();
    }
    
    return isValidToken();
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
};

export const withdrawAccount = async (password: string) => {
  try {
    if (useMock) {
      return mockAuthService.withdrawAccount(password);
    }
    return post<void>('/auth/withdraw', { password });
  } catch (error) {
    console.error('Withdraw account error:', error);
    return {
      success: false,
      message: '회원탈퇴 처리 중 오류가 발생했습니다.',
      data: null,
      timestamp: new Date().toISOString()
    };
  }
}; 