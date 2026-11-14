import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  HardHat,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  User,
  Building2,
  Wrench,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  KeyRound,
  Check,
  Radio,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AuthService, DEMO_USERS } from '../services/authService';
import { UserRole } from '../types';
import {
  LoginCredentials,
  SignUpPayload,
  ValidationErrors,
  PasswordStrength,
} from '../types/auth';

export const AuthPage: React.FC = () => {
  const { login, signup, demoLogin, projects, addWorker } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Login Form State
  const [loginForm, setLoginForm] = useState<LoginCredentials>({
    emailOrPhone: '',
    password: '',
    rememberMe: true,
  });

  // Sign Up Form State
  const [signupForm, setSignupForm] = useState<SignUpPayload>({
    fullName: '',
    email: '',
    phone: '',
    role: 'site_supervisor',
    siteId: 'proj-1',
    siteName: 'Metro Elevated Corridor - Pier 24–40',
    trade: 'mason',
    password: '',
    confirmPassword: '',
    agreeToSafetyProtocol: false,
  });

  // Validation Errors
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real-time password strength calculation
  const passwordStrength: PasswordStrength = AuthService.evaluatePasswordStrength(
    mode === 'login' ? loginForm.password : signupForm.password
  );

  // Field Blur handler for real-time validation feedback
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors = { ...errors };

    if (mode === 'login') {
      if (field === 'emailOrPhone') {
        const id = loginForm.emailOrPhone.trim();
        if (!id) {
          newErrors.email = 'Email address or mobile phone is required.';
        } else if (id.includes('@')) {
          const err = AuthService.validateEmail(id);
          if (err) newErrors.email = err;
          else delete newErrors.email;
        } else {
          const err = AuthService.validatePhone(id);
          if (err) newErrors.email = err;
          else delete newErrors.email;
        }
      }
      if (field === 'password') {
        if (!loginForm.password) {
          newErrors.password = 'Password is required.';
        } else {
          delete newErrors.password;
        }
      }
    } else {
      if (field === 'fullName') {
        const err = AuthService.validateFullName(signupForm.fullName);
        if (err) newErrors.fullName = err;
        else delete newErrors.fullName;
      }
      if (field === 'email') {
        const err = AuthService.validateEmail(signupForm.email);
        if (err) newErrors.email = err;
        else delete newErrors.email;
      }
      if (field === 'phone') {
        const err = AuthService.validatePhone(signupForm.phone);
        if (err) newErrors.phone = err;
        else delete newErrors.phone;
      }
      if (field === 'password') {
        const err = AuthService.validatePassword(signupForm.password);
        if (err) newErrors.password = err;
        else delete newErrors.password;
      }
      if (field === 'confirmPassword') {
        if (!signupForm.confirmPassword) {
          newErrors.confirmPassword = 'Confirmation password is required.';
        } else if (signupForm.password !== signupForm.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match.';
        } else {
          delete newErrors.confirmPassword;
        }
      }
      if (field === 'agreeToSafetyProtocol') {
        if (!signupForm.agreeToSafetyProtocol) {
          newErrors.agreeToSafetyProtocol = 'You must accept the site safety & biometric compliance policy.';
        } else {
          delete newErrors.agreeToSafetyProtocol;
        }
      }
    }

    setErrors(newErrors);
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ emailOrPhone: true, password: true });

    const validation = AuthService.validateLogin(loginForm);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      await login(loginForm);
      setFeedbackSuccess('Authenticated successfully! Entering Jobsite Operations Portal...');
    } catch (err: any) {
      setErrors({ general: err.message || 'Login failed. Please check credentials.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Sign Up
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      role: true,
      siteId: true,
      password: true,
      confirmPassword: true,
      agreeToSafetyProtocol: true,
    });

    const validation = AuthService.validateSignUp(signupForm);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      // Find site name
      const selProj = projects.find((p) => p.id === signupForm.siteId);
      const payload: SignUpPayload = {
        ...signupForm,
        siteName: selProj ? selProj.name : 'Metro Elevated Corridor - Pier 24–40',
      };

      await signup(payload);

      // If user is a worker, also enroll them in the active roster
      if (payload.role === 'worker') {
        addWorker({
          fullName: payload.fullName,
          trade: (payload.trade as any) || 'mason',
          assignedSiteId: payload.siteId,
          assignedSiteName: payload.siteName || 'Metro Elevated Corridor',
          dailyWageRate: payload.trade === 'mason' ? 850 : 700,
          verificationStatus: 'verified',
          safetyCertified: true,
          phone: payload.phone,
          joinedDate: new Date().toISOString().split('T')[0],
        });
      }

      setFeedbackSuccess('Account registered successfully! Entering Jobsite Operations Portal...');
    } catch (err: any) {
      setErrors({ general: err.message || 'Registration failed. Please review the inputs.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Demo Auto-Fill & Instant Login
  const handleDemoQuickAccess = async (role: UserRole) => {
    setIsSubmitting(true);
    setErrors({});
    try {
      await demoLogin(role);
      setFeedbackSuccess(`Entering as ${role.toUpperCase().replace('_', ' ')}...`);
    } catch (err: any) {
      setErrors({ general: err.message || 'Demo login failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D8CCB9] flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-blueprint-grid selection:bg-[#A77B50]/30 selection:text-[#252521]">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-[28px] overflow-hidden shadow-[0_25px_60px_-15px_rgba(37,37,33,0.35)] border border-[#51483D]/40 bg-[#252521]">
        
        {/* ================= LEFT COLUMN: HERO & ARCHITECTURAL IDENTITY ================= */}
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-[#252521] via-[#2d2c26] to-[#1c1b18] text-[#F4F0E8] border-b lg:border-b-0 lg:border-r border-[#51483D]/50 relative overflow-hidden">
          
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#A77B50]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#15803D]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Block */}
          <div className="relative z-10">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#A77B50] flex items-center justify-center text-[#252521] shadow-lg shadow-[#A77B50]/20 font-black text-xl">
                <HardHat className="w-7 h-7 text-[#252521]" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-[#F4F0E8] block">
                  Build<span className="text-[#A77B50]">Ease</span>
                </span>
                <span className="text-xs font-semibold text-[#96938B] tracking-wider uppercase block">
                  Workforce &amp; Site Operations
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#51483D]/60 border border-[#A77B50]/40 text-xs font-bold text-[#A77B50] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A77B50] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A77B50]"></span>
              </span>
              <span>24ITL32 Design Thinking Platform</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F4F0E8] leading-snug mb-4">
              Transparent Workforce Management for Construction Sites.
            </h1>

            <p className="text-sm text-[#96938B] leading-relaxed mb-8">
              Guaranteed wage justice, edge AI contactless facial attendance, 2G keypad voice inclusion, and zero-fraud payroll calculations.
            </p>

            {/* Core Capability Pillars */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#51483D]/30 border border-[#51483D]/50">
                <div className="p-1.5 rounded-lg bg-[#A77B50]/20 text-[#A77B50] mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F4F0E8]">Edge AI Biometric Verification</h4>
                  <p className="text-[11px] text-[#96938B]">
                    3-second YuNet + SFace recognition unaffected by dust-coated or worn hands.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#51483D]/30 border border-[#51483D]/50">
                <div className="p-1.5 rounded-lg bg-[#15803D]/20 text-[#15803D] mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F4F0E8]">2G GSM IVR &amp; PIN Telephony</h4>
                  <p className="text-[11px] text-[#96938B]">
                    100% digital inclusion for workers carrying basic keypad feature phones without internet.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#51483D]/30 border border-[#51483D]/50">
                <div className="p-1.5 rounded-lg bg-[#0284c7]/20 text-[#38bdf8] mt-0.5">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F4F0E8]">Immutable Wage Formula</h4>
                  <p className="text-[11px] text-[#96938B]">
                    [Wage = (Daily Rate &times; Verified Shifts) &minus; Advances] + 5-language SMS slips.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Mason Quote Card */}
          <div className="relative z-10 mt-8 pt-6 border-t border-[#51483D]/60">
            <p className="text-xs italic text-[#D8CCB9] leading-relaxed mb-2">
              &ldquo;These hands built 50 houses in this town, but at the end of the month, I have to beg for my hard-earned wages. Give me proof nobody can tamper with.&rdquo;
            </p>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#A77B50]">&mdash; Murugesan K., 42 (Senior Mason)</span>
              <span className="text-[#96938B]">SKS Builders Site Pilot</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: AUTHENTICATION FORM ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 bg-[#252521] text-[#F4F0E8] flex flex-col justify-center">
          
          {/* Top Mode Selector Tabs */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#51483D]/50">
            <div className="flex p-1 rounded-xl bg-[#1c1b18] border border-[#51483D]/60">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrors({});
                  setFeedbackSuccess(null);
                }}
                className={`px-5 py-2 rounded-lg text-xs font-extrabold tracking-wide transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-[#A77B50] text-[#252521] shadow-md shadow-[#A77B50]/30'
                    : 'text-[#96938B] hover:text-[#F4F0E8]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrors({});
                  setFeedbackSuccess(null);
                }}
                className={`px-5 py-2 rounded-lg text-xs font-extrabold tracking-wide transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#A77B50] text-[#252521] shadow-md shadow-[#A77B50]/30'
                    : 'text-[#96938B] hover:text-[#F4F0E8]'
                }`}
              >
                Create Account
              </button>
            </div>

            <span className="text-xs font-semibold text-[#96938B] hidden sm:inline">
              {mode === 'login' ? 'Existing site personnel' : 'New workforce registration'}
            </span>
          </div>

          {/* Quick Demo Credentials Bar */}
          <div className="mb-6 p-3.5 rounded-2xl bg-[#1e1d19] border border-[#51483D]/60">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-[#A77B50] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Quick Demo One-Click Access
              </span>
              <span className="text-[10px] text-[#96938B]">Pre-configured test roles</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleDemoQuickAccess('contractor')}
                disabled={isSubmitting}
                className="px-2.5 py-2 rounded-xl bg-[#252521] hover:bg-[#A77B50]/20 border border-[#51483D] hover:border-[#A77B50] text-[11px] font-bold text-[#F4F0E8] transition-all flex flex-col items-center gap-0.5 cursor-pointer text-center"
              >
                <span className="text-xs">👷 Contractor</span>
                <span className="text-[9px] text-[#96938B]">Admin / Director</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoQuickAccess('site_supervisor')}
                disabled={isSubmitting}
                className="px-2.5 py-2 rounded-xl bg-[#252521] hover:bg-[#A77B50]/20 border border-[#51483D] hover:border-[#A77B50] text-[11px] font-bold text-[#F4F0E8] transition-all flex flex-col items-center gap-0.5 cursor-pointer text-center"
              >
                <span className="text-xs">📋 Supervisor</span>
                <span className="text-[9px] text-[#96938B]">Muster Sign-off</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoQuickAccess('project_manager')}
                disabled={isSubmitting}
                className="px-2.5 py-2 rounded-xl bg-[#252521] hover:bg-[#A77B50]/20 border border-[#51483D] hover:border-[#A77B50] text-[11px] font-bold text-[#F4F0E8] transition-all flex flex-col items-center gap-0.5 cursor-pointer text-center"
              >
                <span className="text-xs">🏗️ PM Officer</span>
                <span className="text-[9px] text-[#96938B]">Progress / Specs</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoQuickAccess('worker')}
                disabled={isSubmitting}
                className="px-2.5 py-2 rounded-xl bg-[#252521] hover:bg-[#A77B50]/20 border border-[#51483D] hover:border-[#A77B50] text-[11px] font-bold text-[#F4F0E8] transition-all flex flex-col items-center gap-0.5 cursor-pointer text-center"
              >
                <span className="text-xs">🔨 Senior Mason</span>
                <span className="text-[9px] text-[#96938B]">Murugesan K.</span>
              </button>
            </div>
          </div>

          {/* Feedback & Error Banners */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-5 p-3.5 rounded-xl bg-[#B91C1C]/15 border border-[#B91C1C]/40 text-[#fca5a5] text-xs flex items-center gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-[#ef4444] shrink-0" />
                <span>{errors.general}</span>
              </motion.div>
            )}

            {feedbackSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-5 p-3.5 rounded-xl bg-[#15803D]/15 border border-[#15803D]/40 text-[#86efac] text-xs flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                <span>{feedbackSuccess}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= MODE: LOGIN ================= */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#D8CCB9] mb-1.5">
                  Email Address or 10-Digit Mobile Phone <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96938B]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={loginForm.emailOrPhone}
                    onChange={(e) => {
                      setLoginForm((prev) => ({ ...prev, emailOrPhone: e.target.value }));
                      if (touched.emailOrPhone) validateField('emailOrPhone');
                    }}
                    onBlur={() => handleBlur('emailOrPhone')}
                    placeholder="contractor@buildease.in or 9876500001"
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#1c1b18] border rounded-xl text-xs text-[#F4F0E8] placeholder-[#96938B]/60 focus:outline-none transition-colors ${
                      touched.emailOrPhone && errors.email
                        ? 'border-[#B91C1C] focus:border-[#ef4444]'
                        : 'border-[#51483D] focus:border-[#A77B50]'
                    }`}
                  />
                </div>
                {touched.emailOrPhone && errors.email && (
                  <p className="mt-1 text-[11px] text-[#fca5a5] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-[#ef4444]" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#D8CCB9]">
                    Security Password <span className="text-[#ef4444]">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginForm((prev) => ({
                        ...prev,
                        password: 'Password@123',
                      }));
                      setTouched((prev) => ({ ...prev, password: true }));
                    }}
                    className="text-[11px] text-[#A77B50] hover:underline cursor-pointer"
                  >
                    Auto-fill default password
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#96938B]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => {
                      setLoginForm((prev) => ({ ...prev, password: e.target.value }));
                      if (touched.password) validateField('password');
                    }}
                    onBlur={() => handleBlur('password')}
                    placeholder="Enter account password"
                    className={`w-full pl-10 pr-10 py-2.5 bg-[#1c1b18] border rounded-xl text-xs text-[#F4F0E8] placeholder-[#96938B]/60 focus:outline-none transition-colors ${
                      touched.password && errors.password
                        ? 'border-[#B91C1C] focus:border-[#ef4444]'
                        : 'border-[#51483D] focus:border-[#A77B50]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#96938B] hover:text-[#F4F0E8] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="mt-1 text-[11px] text-[#fca5a5] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-[#ef4444]" /> {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#96938B]">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) =>
                      setLoginForm((prev) => ({ ...prev, rememberMe: e.target.checked }))
                    }
                    className="w-4 h-4 rounded bg-[#1c1b18] border-[#51483D] text-[#A77B50] focus:ring-0 cursor-pointer"
                  />
                  <span>Remember session on this device</span>
                </label>

                <span className="text-[11px] text-[#96938B]">
                  BOCW &amp; GPS Geofence Protected
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-5 rounded-xl bg-[#A77B50] hover:bg-[#936B42] text-[#252521] font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-[#A77B50]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Enter Jobsite Operations</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ================= MODE: SIGN UP ================= */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#D8CCB9] mb-1">
                  Full Legal Name <span className="text-[#ef4444]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#96938B]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={signupForm.fullName}
                    onChange={(e) => {
                      setSignupForm((prev) => ({ ...prev, fullName: e.target.value }));
                      if (touched.fullName) validateField('fullName');
                    }}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="e.g. Rameshwar Yadav"
                    className={`w-full pl-9 pr-3 py-2 bg-[#1c1b18] border rounded-xl text-xs text-[#F4F0E8] placeholder-[#96938B]/60 focus:outline-none transition-colors ${
                      touched.fullName && errors.fullName
                        ? 'border-[#B91C1C]'
                        : 'border-[#51483D] focus:border-[#A77B50]'
                    }`}
                  />
                </div>
                {touched.fullName && errors.fullName && (
                  <p className="mt-0.5 text-[10.5px] text-[#fca5a5] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-[#ef4444]" /> {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#D8CCB9] mb-1">
                    Email Address <span className="text-[#ef4444]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#96938B]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => {
                        setSignupForm((prev) => ({ ...prev, email: e.target.value }));
                        if (touched.email) validateField('email');
                      }}
                      onBlur={() => handleBlur('email')}
                      placeholder="worker@buildease.in"
                      className={`w-full pl-9 pr-3 py-2 bg-[#1c1b18] border rounded-xl text-xs text-[#F4F0E8] placeholder-[#96938B]/60 focus:outline-none transition-colors ${
                        touched.email && errors.email
                          ? 'border-[#B91C1C]'
                          : 'border-[#51483D] focus:border-[#A77B50]'
                      }`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-0.5 text-[10.5px] text-[#fca5a5] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-[#ef4444]" /> {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#D8CCB9] mb-1">
                    10-Digit Mobile Phone <span className="text-[#ef4444]">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#96938B]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      value={signupForm.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setSignupForm((prev) => ({ ...prev, phone: val }));
                        if (touched.phone) validateField('phone');
                      }}
                      onBlur={() => handleBlur('phone')}
                      placeholder="9876543210"
                      className={`w-full pl-9 pr-3 py-2 bg-[#1c1b18] border rounded-xl text-xs text-[#F4F0E8] placeholder-[#96938B]/60 focus:outline-none transition-colors ${
                        touched.phone && errors.phone
                          ? 'border-[#B91C1C]'
                          : 'border-[#51483D] focus:border-[#A77B50]'
                      }`}
                    />
                  </div>
                  {touched.phone && errors.phone && (
                    <p className="mt-0.5 text-[10.5px] text-[#fca5a5] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-[#ef4444]" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-[#D8CCB9] mb-1">
                  Site Role / Capacity <span className="text-[#ef4444]">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'site_supervisor', label: 'Supervisor', desc: 'Muster sign-off' },
                    { id: 'contractor', label: 'Contractor', desc: 'Director' },
                    { id: 'project_manager', label: 'Project Mgr', desc: 'Delivery' },
                    { id: 'worker', label: 'Skilled Artisan', desc: 'Mason/Helper' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() =>
                        setSignupForm((prev) => ({
                          ...prev,
                          role: r.id as UserRole,
                        }))
                      }
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        signupForm.role === r.id
                          ? 'bg-[#A77B50]/20 border-[#A77B50] text-[#F4F0E8]'
                          : 'bg-[#1c1b18] border-[#51483D] text-[#96938B] hover:border-[#A77B50]/50'
                      }`}
                    >
                      <span className="text-xs font-bold block">{r.label}</span>
                      <span className="text-[10px] text-[#96938B] block">{r.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Site Assignment & Trade */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#D8CCB9] mb-1">
                    Primary Construction Site <span className="text-[#ef4444]">*</span>
                  </label>
                  <select
                    value={signupForm.siteId}
                    onChange={(e) => {
                      const p = projects.find((pr) => pr.id === e.target.value);
                      setSignupForm((prev) => ({
                        ...prev,
                        siteId: e.target.value,
                        siteName: p ? p.name : prev.siteName,
                      }));
                    }}
                    className="w-full px-3 py-2 bg-[#1c1b18] border border-[#51483D] rounded-xl text-xs text-[#F4F0E8] focus:border-[#A77B50] focus:outline-none"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {signupForm.role === 'worker' ? (
                  <div>
                    <label className="block text-xs font-bold text-[#D8CCB9] mb-1">
                      Trade Skill Specialization <span className="text-[#ef4444]">*</span>
                    </label>
                    <select
                      value={signupForm.trade}
                      onChange={(e) =>
                        setSignupForm((prev) => ({ ...prev, trade: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-[#1c1b18] border border-[#51483D] rounded-xl text-xs text-[#F4F0E8] focus:border-[#A77B50] focus:outline-none"
                    >
                      <option value="mason">Mason (AAC / Brickwork)</option>
                      <option value="steel_fixer">Steel Fixer (Rebar Tying)</option>
                      <option value="carpenter">Formwork Carpenter</option>
                      <option value="electrician">Site Electrician</option>
                      <option value="equipment_operator">Heavy Equipment Operator</option>
                      <option value="general_helper">General Helper</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#D8CCB9] mb-1">
                      Department / Wing
                    </label>
                    <input
                      type="text"
                      disabled
                      value={
                        signupForm.role === 'contractor'
                          ? 'General Contracting PMO'
                          : signupForm.role === 'project_manager'
                          ? 'Engineering & Delivery'
                          : 'Civil Site Operations'
                      }
                      className="w-full px-3 py-2 bg-[#1c1b18]/60 border border-[#51483D] rounded-xl text-xs text-[#96938B]"
                    />
                  </div>
                )}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#D8CCB9] mb-1">
                    Password (Min 8 Chars) <span className="text-[#ef4444]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={(e) => {
                        setSignupForm((prev) => ({ ...prev, password: e.target.value }));
                        if (touched.password) validateField('password');
                      }}
                      onBlur={() => handleBlur('password')}
                      placeholder="Password@123"
                      className={`w-full px-3 py-2 pr-8 bg-[#1c1b18] border rounded-xl text-xs text-[#F4F0E8] placeholder-[#96938B]/60 focus:outline-none ${
                        touched.password && errors.password
                          ? 'border-[#B91C1C]'
                          : 'border-[#51483D] focus:border-[#A77B50]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#96938B] hover:text-[#F4F0E8]"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#D8CCB9] mb-1">
                    Confirm Password <span className="text-[#ef4444]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={signupForm.confirmPassword}
                      onChange={(e) => {
                        setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }));
                        if (touched.confirmPassword) validateField('confirmPassword');
                      }}
                      onBlur={() => handleBlur('confirmPassword')}
                      placeholder="Re-enter password"
                      className={`w-full px-3 py-2 pr-8 bg-[#1c1b18] border rounded-xl text-xs text-[#F4F0E8] placeholder-[#96938B]/60 focus:outline-none ${
                        touched.confirmPassword && errors.confirmPassword
                          ? 'border-[#B91C1C]'
                          : 'border-[#51483D] focus:border-[#A77B50]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#96938B] hover:text-[#F4F0E8]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {signupForm.password && (
                <div className="p-2.5 rounded-xl bg-[#1c1b18] border border-[#51483D]/60 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#96938B]">Password Strength:</span>
                    <span
                      className={`font-bold ${
                        passwordStrength.label === 'Strong'
                          ? 'text-[#22c55e]'
                          : passwordStrength.label === 'Good'
                          ? 'text-[#38bdf8]'
                          : passwordStrength.label === 'Fair'
                          ? 'text-[#f59e0b]'
                          : 'text-[#ef4444]'
                      }`}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-[#51483D]/50 overflow-hidden flex">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.score >= 1
                          ? passwordStrength.score >= 4
                            ? 'bg-[#22c55e] w-full'
                            : passwordStrength.score === 3
                            ? 'bg-[#38bdf8] w-3/4'
                            : passwordStrength.score === 2
                            ? 'bg-[#f59e0b] w-1/2'
                            : 'bg-[#ef4444] w-1/4'
                          : 'w-0'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px] text-[#96938B] pt-0.5">
                    <span className={passwordStrength.hasMinLength ? 'text-[#86efac]' : ''}>
                      ✓ 8+ Characters
                    </span>
                    <span className={passwordStrength.hasUppercase && passwordStrength.hasLowercase ? 'text-[#86efac]' : ''}>
                      ✓ Upper &amp; Lower
                    </span>
                    <span className={passwordStrength.hasNumber ? 'text-[#86efac]' : ''}>
                      ✓ 1+ Number
                    </span>
                    <span className={passwordStrength.hasSpecialChar ? 'text-[#86efac]' : ''}>
                      ✓ 1+ Symbol (@,$,!)
                    </span>
                  </div>
                </div>
              )}

              {touched.password && errors.password && (
                <p className="text-[10.5px] text-[#fca5a5] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-[#ef4444]" /> {errors.password}
                </p>
              )}

              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-[10.5px] text-[#fca5a5] flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-[#ef4444]" /> {errors.confirmPassword}
                </p>
              )}

              {/* Safety Protocol Acknowledgment */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={signupForm.agreeToSafetyProtocol}
                    onChange={(e) => {
                      setSignupForm((prev) => ({
                        ...prev,
                        agreeToSafetyProtocol: e.target.checked,
                      }));
                      if (touched.agreeToSafetyProtocol) validateField('agreeToSafetyProtocol');
                    }}
                    onBlur={() => handleBlur('agreeToSafetyProtocol')}
                    className="w-4 h-4 mt-0.5 rounded bg-[#1c1b18] border-[#51483D] text-[#A77B50] focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-[#96938B] leading-tight">
                    I acknowledge compliance with the <strong>BOCW Act (1996)</strong>, site GPS geofence tracking (100m gate perimeter), and agree to client-side edge biometric processing.
                  </span>
                </label>
                {touched.agreeToSafetyProtocol && errors.agreeToSafetyProtocol && (
                  <p className="mt-1 text-[10.5px] text-[#fca5a5] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-[#ef4444]" /> {errors.agreeToSafetyProtocol}
                  </p>
                )}
              </div>

              {/* Submit Sign Up Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-5 rounded-xl bg-[#A77B50] hover:bg-[#936B42] text-[#252521] font-extrabold text-sm tracking-wide transition-all shadow-lg shadow-[#A77B50]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Registering Profile...</span>
                ) : (
                  <>
                    <span>Complete Registration &amp; Enter</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Security Assurance */}
          <div className="mt-6 pt-4 border-t border-[#51483D]/40 flex flex-wrap items-center justify-between text-[11px] text-[#96938B]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" /> End-to-End Edge Biometric Encryption
            </span>
            <span>Kongu Engineering College &copy; 2026</span>
          </div>
        </div>

      </div>
    </div>
  );
};
