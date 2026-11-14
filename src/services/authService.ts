import {
  UserAccount,
  LoginCredentials,
  SignUpPayload,
  ValidationErrors,
  PasswordStrength,
} from '../types/auth';

const STORAGE_KEY_AUTH_USER = 'buildease_auth_user';
const STORAGE_KEY_AUTH_TOKEN = 'buildease_auth_token';
const STORAGE_KEY_REGISTERED_USERS = 'buildease_registered_users';

export const DEMO_USERS: (UserAccount & { passwordHash: string })[] = [
  {
    id: 'USR-CON-01',
    fullName: 'Rajesh Singhania',
    email: 'contractor@buildease.in',
    phone: '9876500001',
    role: 'contractor',
    department: 'General Contracting & Executive Management',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor - Pier 24–40',
    avatar: 'RS',
    passwordHash: 'Password@123',
    createdAt: '2025-08-01T08:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'USR-SUP-01',
    fullName: 'Aniket Patil',
    email: 'supervisor.patil@buildease.in',
    phone: '9876500002',
    role: 'site_supervisor',
    department: 'Site Operations & Civil Supervision',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor - Pier 24–40',
    avatar: 'AP',
    passwordHash: 'Password@123',
    createdAt: '2025-08-15T08:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'USR-PM-01',
    fullName: 'Rajesh Sharma',
    email: 'pm.sharma@buildease.in',
    phone: '9876500003',
    role: 'project_manager',
    department: 'Infrastructure Delivery & Procurement',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor - Pier 24–40',
    avatar: 'RS',
    passwordHash: 'Password@123',
    createdAt: '2025-08-15T08:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: 'USR-WRK-01',
    fullName: 'Murugesan K.',
    email: 'murugesan@buildease.in',
    phone: '9876500004',
    role: 'worker',
    department: 'Trade Masonry & Structural Works',
    trade: 'mason',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor - Pier 24–40',
    avatar: 'MK',
    passwordHash: 'Password@123',
    createdAt: '2025-09-01T08:00:00Z',
    lastLoginAt: new Date().toISOString(),
  },
];

export class AuthService {
  /**
   * Evaluate password complexity for real-time strength meter
   */
  public static evaluatePasswordStrength(password: string): PasswordStrength {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase && hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    let label: PasswordStrength['label'] = 'Weak';
    if (score === 2) label = 'Fair';
    else if (score === 3) label = 'Good';
    else if (score >= 4) label = 'Strong';

    return {
      score,
      label,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    };
  }

  /**
   * Email field validation
   */
  public static validateEmail(email: string): string | null {
    if (!email || !email.trim()) {
      return 'Email address is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid business email address (e.g., name@domain.com).';
    }
    return null;
  }

  /**
   * Phone number validation (10-digit Indian standard)
   */
  public static validatePhone(phone: string): string | null {
    if (!phone || !phone.trim()) {
      return 'Mobile phone number is required.';
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      return 'Please enter a valid 10-digit mobile number.';
    }
    if (!/^[6-9]/.test(cleanPhone)) {
      return 'Mobile number must start with 6, 7, 8, or 9.';
    }
    return null;
  }

  /**
   * Full name validation
   */
  public static validateFullName(name: string): string | null {
    if (!name || !name.trim()) {
      return 'Full legal name is required.';
    }
    if (name.trim().length < 3) {
      return 'Full name must be at least 3 characters long.';
    }
    if (!/^[a-zA-Z\s\.\'-]+$/.test(name.trim())) {
      return 'Name must contain only letters, spaces, or hyphens.';
    }
    return null;
  }

  /**
   * Password validation
   */
  public static validatePassword(password: string): string | null {
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter (A-Z).';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter (a-z).';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number (0-9).';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Password must contain at least one special symbol (@, $, !, %, *, ?, &).';
    }
    return null;
  }

  /**
   * Comprehensive Sign Up validation
   */
  public static validateSignUp(payload: SignUpPayload): ValidationErrors {
    const errors: ValidationErrors = {};

    const nameErr = this.validateFullName(payload.fullName);
    if (nameErr) errors.fullName = nameErr;

    const emailErr = this.validateEmail(payload.email);
    if (emailErr) errors.email = emailErr;

    const phoneErr = this.validatePhone(payload.phone);
    if (phoneErr) errors.phone = phoneErr;

    if (!payload.role) {
      errors.role = 'Please select your site operational role.';
    }

    if (!payload.siteId) {
      errors.siteId = 'Please select your assigned primary construction site.';
    }

    if (payload.role === 'worker' && !payload.trade) {
      errors.trade = 'Please specify your primary construction trade skill.';
    }

    const passErr = this.validatePassword(payload.password);
    if (passErr) errors.password = passErr;

    if (!payload.confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required.';
    } else if (payload.password !== payload.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!payload.agreeToSafetyProtocol) {
      errors.agreeToSafetyProtocol = 'You must acknowledge the Jobsite Biometric & Safety Policy.';
    }

    return errors;
  }

  /**
   * Comprehensive Login validation
   */
  public static validateLogin(credentials: LoginCredentials): ValidationErrors {
    const errors: ValidationErrors = {};

    const identifier = credentials.emailOrPhone?.trim();
    if (!identifier) {
      errors.email = 'Email address or mobile phone is required.';
    } else {
      const isEmail = identifier.includes('@');
      if (isEmail) {
        const emailErr = this.validateEmail(identifier);
        if (emailErr) errors.email = emailErr;
      } else {
        const phoneErr = this.validatePhone(identifier);
        if (phoneErr) errors.email = phoneErr;
      }
    }

    if (!credentials.password) {
      errors.password = 'Password is required.';
    }

    return errors;
  }

  /**
   * Retrieve all registered users (demo users + local storage created users)
   */
  private static getAllUsers(): (UserAccount & { passwordHash: string })[] {
    let localUsers: (UserAccount & { passwordHash: string })[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
      if (saved) {
        localUsers = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('[AuthService] Could not parse stored users:', e);
    }
    return [...DEMO_USERS, ...localUsers];
  }

  /**
   * Login execution (local + backend sync)
   */
  public static async login(
    credentials: LoginCredentials
  ): Promise<{ user: UserAccount; token: string }> {
    const errors = this.validateLogin(credentials);
    if (Object.keys(errors).length > 0) {
      const firstErr = Object.values(errors)[0];
      throw new Error(firstErr);
    }

    const identifier = credentials.emailOrPhone.trim().toLowerCase();
    const cleanPhone = credentials.emailOrPhone.replace(/[^0-9]/g, '');

    const allUsers = this.getAllUsers();
    const matched = allUsers.find((u) => {
      const emailMatches = u.email.toLowerCase() === identifier;
      const phoneMatches = u.phone.replace(/[^0-9]/g, '') === cleanPhone;
      return (emailMatches || phoneMatches) && u.passwordHash === credentials.password;
    });

    if (!matched) {
      throw new Error(
        'Invalid credentials. Please verify your email/phone and password, or use one of the Quick Demo Logins below.'
      );
    }

    const { passwordHash, ...safeUser } = matched;
    safeUser.lastLoginAt = new Date().toISOString();

    const token = `jwt_be_${Date.now()}_${safeUser.id}_${Math.random().toString(36).substring(2, 8)}`;
    this.saveSession(safeUser, token, credentials.rememberMe !== false);

    // Also attempt backend login sync if API is reachable
    try {
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: credentials.emailOrPhone,
          password: credentials.password,
        }),
      }).catch(() => {});
    } catch {}

    return { user: safeUser, token };
  }

  /**
   * Sign up execution
   */
  public static async signup(
    payload: SignUpPayload
  ): Promise<{ user: UserAccount; token: string }> {
    const errors = this.validateSignUp(payload);
    if (Object.keys(errors).length > 0) {
      const firstErr = Object.values(errors)[0];
      throw new Error(firstErr);
    }

    const allUsers = this.getAllUsers();
    const emailExists = allUsers.some(
      (u) => u.email.toLowerCase() === payload.email.trim().toLowerCase()
    );
    if (emailExists) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const cleanPhone = payload.phone.replace(/[^0-9]/g, '');
    const phoneExists = allUsers.some(
      (u) => u.phone.replace(/[^0-9]/g, '') === cleanPhone
    );
    if (phoneExists) {
      throw new Error('An account with this mobile phone number already exists.');
    }

    // Generate Initials Avatar
    const initials = payload.fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const rolePrefix = payload.role.substring(0, 3).toUpperCase();
    const newUser: UserAccount & { passwordHash: string } = {
      id: `USR-${rolePrefix}-${Date.now().toString().slice(-4)}`,
      fullName: payload.fullName.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: cleanPhone,
      role: payload.role,
      siteId: payload.siteId,
      siteName: payload.siteName || 'Metro Elevated Corridor - Pier 24–40',
      trade: payload.trade,
      department:
        payload.role === 'contractor'
          ? 'Contractor & Executive Administration'
          : payload.role === 'project_manager'
          ? 'Project Management Office'
          : payload.role === 'site_supervisor'
          ? 'Site Operations & Civil Supervision'
          : 'Trade Artisan Crew',
      avatar: initials,
      passwordHash: payload.password,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    // Store in localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REGISTERED_USERS);
      const existing: (UserAccount & { passwordHash: string })[] = saved ? JSON.parse(saved) : [];
      existing.push(newUser);
      localStorage.setItem(STORAGE_KEY_REGISTERED_USERS, JSON.stringify(existing));
    } catch (e) {
      console.warn('[AuthService] Could not persist new user:', e);
    }

    const { passwordHash, ...safeUser } = newUser;
    const token = `jwt_be_${Date.now()}_${safeUser.id}_${Math.random().toString(36).substring(2, 8)}`;
    this.saveSession(safeUser, token, true);

    // Call backend signup API asynchronously
    try {
      fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          role: payload.role,
          siteId: payload.siteId,
          trade: payload.trade,
          password: payload.password,
        }),
      }).catch(() => {});
    } catch {}

    return { user: safeUser, token };
  }

  /**
   * Save session to storage
   */
  public static saveSession(user: UserAccount, token: string, persistent = true) {
    try {
      const storage = persistent ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(user));
      storage.setItem(STORAGE_KEY_AUTH_TOKEN, token);
    } catch (e) {
      console.warn('[AuthService] Storage write error:', e);
    }
  }

  /**
   * Retrieve active session
   */
  public static getCurrentSession(): UserAccount | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUTH_USER) || sessionStorage.getItem(STORAGE_KEY_AUTH_USER);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[AuthService] Storage read error:', e);
    }
    return null;
  }

  /**
   * Logout and clear session
   */
  public static logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH_USER);
      localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEY_AUTH_USER);
      sessionStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
    } catch (e) {
      console.warn('[AuthService] Logout storage clear error:', e);
    }
  }
}
