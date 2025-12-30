/**
 * User profile information returned upon successful authentication
 */
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Data required for the Login request
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Data required for the Registration request
 * Note: password_confirmation is required by most Laravel-based backends
 */
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Standard response structure for Login, Register, and Refresh endpoints
 */
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: User;
}

/**
 * Interface for API Error responses to handle catch blocks
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}