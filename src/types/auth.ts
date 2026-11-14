import { UserRole } from './index';

export interface UserAccount {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  siteId?: string;
  siteName?: string;
  trade?: string;
  department?: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  siteId: string;
  siteName?: string;
  trade?: string;
  password: string;
  confirmPassword: string;
  agreeToSafetyProtocol: boolean;
}

export interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  siteId?: string;
  trade?: string;
  password?: string;
  confirmPassword?: string;
  agreeToSafetyProtocol?: string;
  general?: string;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}
