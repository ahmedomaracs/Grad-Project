'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, User, Phone, Mail, Lock, ShieldCheck, Check, X as XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { getRoleDashboardPath } from '../../lib/navigation';
import { authApi } from '../../lib/services/authApi';

/* ------------------------------------------------------------------ */
/*  Password rules — mirrors the backend's ASP.NET Identity config     */
/* ------------------------------------------------------------------ */
const PASSWORD_RULES = [
  {
    key: 'minLength',
    label: 'At least 8 characters',
    test: (v: string) => v.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'At least one uppercase letter (A–Z)',
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    key: 'lowercase',
    label: 'At least one lowercase letter (a–z)',
    test: (v: string) => /[a-z]/.test(v),
  },
  {
    key: 'digit',
    label: 'At least one digit (0–9)',
    test: (v: string) => /[0-9]/.test(v),
  },
  {
    key: 'nonAlphanumeric',
    label: 'At least one special character (!@#$%…)',
    test: (v: string) => /[^A-Za-z0-9]/.test(v),
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Zod schema — matches backend Identity requirements exactly          */
/* ------------------------------------------------------------------ */
const signupSchema = z
  .object({
    name: z.string().min(3, 'Full name is required (min 3 characters)'),
    phone: z.string().min(8, 'Phone number must be at least 8 digits'),
    email: z.string().email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a digit')
      .regex(/[^A-Za-z0-9]/, 'Must contain a special character (!@#$%…)'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agree: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the terms and privacy policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

/* ------------------------------------------------------------------ */
/*  Backend error code → friendly message map                          */
/* ------------------------------------------------------------------ */
const BACKEND_ERROR_MAP: Record<string, string> = {
  PasswordRequiresNonAlphanumeric: 'Add a special character (!@#$%…)',
  PasswordRequiresUpper: 'Add an uppercase letter (A–Z)',
  PasswordRequiresLower: 'Add a lowercase letter (a–z)',
  PasswordRequiresDigit: 'Add a digit (0–9)',
  PasswordTooShort: 'Password is too short (min 8 characters)',
  DuplicateEmail: 'This email is already registered. Try signing in.',
  DuplicateUserName: 'This username is already taken.',
  InvalidEmail: 'Please enter a valid email address.',
};

/* ------------------------------------------------------------------ */
/*  Parse the [{code, description}] array the backend returns          */
/* ------------------------------------------------------------------ */
function parseBackendErrors(error: unknown): string {
  if (!error || typeof error !== 'object') return 'Registration failed. Please try again.';
  const axiosErr = error as { response?: { data?: unknown } };
  const data = axiosErr.response?.data;

  // Array of { code, description }
  if (Array.isArray(data) && data.length > 0) {
    return data
      .map((e: { code?: string; description?: string }) => {
        if (e.code && BACKEND_ERROR_MAP[e.code]) return BACKEND_ERROR_MAP[e.code];
        return e.description || e.code || 'Unknown error';
      })
      .join(' · ');
  }

  // { message: "..." }
  if (data && typeof data === 'object' && 'message' in data) {
    return (data as { message: string }).message;
  }

  // Plain string
  if (typeof data === 'string') return data;

  return 'Registration failed. Please try again.';
}

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const loginUser = useAuthStore((state) => state.login);
  const addToast = useToastStore((state) => state.addToast);
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pwdStrength, setPwdStrength] = useState(0);
  const [pwdFocused, setPwdFocused] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false,
    },
  });

  const passwordVal = watch('password');
  const confirmVal = watch('confirmPassword');

  // Password strength score (0–5 based on rules passing)
  useEffect(() => {
    if (!passwordVal) {
      setPwdStrength(0);
      return;
    }
    const passed = PASSWORD_RULES.filter((r) => r.test(passwordVal)).length;
    setPwdStrength(passed);
  }, [passwordVal]);

  // Re-validate confirmPassword whenever the main password changes so
  // the "Passwords do not match" error clears as soon as they match.
  useEffect(() => {
    if (confirmVal) trigger('confirmPassword');
  }, [passwordVal, trigger, confirmVal]);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    
    const nameParts = data.name.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || firstName;
    const displayName = data.name;

    try {
      const response = await authApi.signup({
        firstName,
        lastName,
        displayName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
      });

      // Extract JWT token if the backend returns it on registration
      const token: string | undefined =
        response?.data?.token ||
        response?.data?.accessToken ||
        response?.data?.jwtToken;

      setIsLoading(false);
      setSuccess(true);
      loginUser(data.email, data.name, true, token);

      addToast({ type: 'success', title: 'Account Created!', message: `Welcome to Automate.` });

      const dashboardPath = callbackUrl || getRoleDashboardPath('Client');
      setTimeout(() => {
        router.push(dashboardPath);
      }, 1800);
    } catch (error: unknown) {
      setIsLoading(false);
      const message = parseBackendErrors(error);
      addToast({ type: 'error', title: 'Registration Failed', message });
    }
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addToast({ type: 'info', title: 'Terms of Service', message: 'By using Automate, you agree to our standard terms. Full document available upon public launch.' });
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addToast({ type: 'info', title: 'Privacy Policy', message: 'We protect your data with enterprise-grade encryption. Full policy available upon public launch.' });
  };

  /* strength bar colour */
  const strengthColor =
    pwdStrength <= 1 ? '#ef4444' : pwdStrength <= 3 ? '#f59e0b' : '#22c55e';
  const strengthLabel =
    pwdStrength === 0 ? '' : pwdStrength <= 1 ? 'Weak' : pwdStrength <= 3 ? 'Medium' : pwdStrength === 4 ? 'Strong' : 'Ultra Secure';

  /* show checklist while password field is focused or has a value */
  const showChecklist = pwdFocused || (!!passwordVal && pwdStrength < 5);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans text-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#E62424]/5 to-transparent blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#E62424]/5 to-transparent blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Link 
          href="/" 
          className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#E62424] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <Card className="glossy-card p-8 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E62424]/10 text-[#E62424] text-xs font-bold uppercase mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Automate Auth
                  </div>
                  <h1 className="font-display text-4xl text-slate-900 mb-1">Create Account</h1>
                  <p className="text-slate-500 text-sm">Join the luxury platform re-engineering car care.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Ahmed Al-Masri"
                          {...register('name')}
                          disabled={isLoading}
                          className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-slate-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                            errors.name ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-[#E62424]/40'
                          }`}
                        />
                        <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                      </div>
                      {errors.name && <p className="text-xs font-bold text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          placeholder="+962 7 9876 5432"
                          {...register('phone')}
                          disabled={isLoading}
                          className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-slate-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                            errors.phone ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-[#E62424]/40'
                          }`}
                        />
                        <Phone className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                      </div>
                      {errors.phone && <p className="text-xs font-bold text-red-500">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="ahmed@example.com"
                        {...register('email')}
                        disabled={isLoading}
                        className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-slate-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                          errors.email ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-[#E62424]/40'
                        }`}
                      />
                      <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                    </div>
                    {errors.email && <p className="text-xs font-bold text-red-500">{errors.email.message}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        disabled={isLoading}
                        onFocus={() => setPwdFocused(true)}
                        onBlur={() => setPwdFocused(false)}
                        className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-slate-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                          errors.password ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-[#E62424]/40'
                        }`}
                      />
                      <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                    </div>

                    {passwordVal && (
                      <div className="pt-1 space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-400">Password Strength:</span>
                          <span style={{ color: strengthColor }} className="transition-colors duration-300">
                            {strengthLabel}
                          </span>
                        </div>
                        <div className="flex gap-1 h-1.5">
                          {[0, 1, 2, 3, 4].map((idx) => (
                            <div
                              key={idx}
                              className="flex-1 rounded-full transition-all duration-300"
                              style={{
                                backgroundColor: idx < pwdStrength ? strengthColor : '#e2e8f0',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <AnimatePresence>
                      {showChecklist && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 p-3 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1.5">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                              Password Requirements
                            </p>
                            {PASSWORD_RULES.map((rule) => {
                              const passed = passwordVal ? rule.test(passwordVal) : false;
                              return (
                                <motion.div
                                  key={rule.key}
                                  initial={false}
                                  animate={{ opacity: 1 }}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                                      passed ? 'bg-green-500' : 'bg-slate-200'
                                    }`}
                                  >
                                    {passed ? (
                                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                    ) : (
                                      <XIcon className="w-2.5 h-2.5 text-slate-400" strokeWidth={3} />
                                    )}
                                  </div>
                                  <span
                                    className={`text-xs font-semibold transition-colors duration-200 ${
                                      passed ? 'text-green-600 line-through decoration-green-400/60' : 'text-slate-500'
                                    }`}
                                  >
                                    {rule.label}
                                  </span>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {errors.password && !showChecklist && (
                      <p className="text-xs font-bold text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Confirm Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                        disabled={isLoading}
                        className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-slate-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                          errors.confirmPassword ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-[#E62424]/40'
                        }`}
                      />
                      <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                    </div>
                    {errors.confirmPassword && <p className="text-xs font-bold text-red-500">{errors.confirmPassword.message}</p>}
                  </div>

                  <div className="flex items-start pt-2">
                    <input
                      id="agree"
                      type="checkbox"
                      {...register('agree')}
                      className="w-4.5 h-4.5 mt-0.5 rounded border-slate-300 focus:ring-red-400 accent-[#E62424] cursor-pointer"
                    />
                    <label htmlFor="agree" className="ml-2.5 text-sm font-semibold text-slate-500 leading-snug cursor-pointer select-none">
                      I agree to the{' '}
                      <button type="button" onClick={handleTermsClick} className="text-[#E62424] hover:underline">Terms of Service</button>
                      {' '}and{' '}
                      <button type="button" onClick={handlePrivacyClick} className="text-[#E62424] hover:underline">Privacy Policy</button>.
                    </label>
                  </div>
                  {errors.agree && <p className="text-xs font-bold text-red-500">{errors.agree.message}</p>}

                  <div className="pt-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      fullWidth
                      size="lg"
                      className="h-13 bg-[#E62424] hover:bg-red-600 shadow-xl shadow-red-500/20 text-white rounded-xl text-base font-bold flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </div>
                </form>

                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or Register With</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {['Google', 'Apple', 'Facebook'].map((provider) => (
                    <button
                      key={provider}
                      type="button"
                      disabled={isLoading}
                      onClick={async () => {
                        setIsLoading(true);
                        await new Promise((r) => setTimeout(r, 1000));
                        setIsLoading(false);
                        loginUser(`${provider.toLowerCase()}@automate.com`, `${provider} User`, true);
                        setSuccess(true);
                        addToast({ type: 'success', title: 'Registered!', message: `Account created with ${provider}.` });
                        const dashboardPath = callbackUrl || getRoleDashboardPath('Client');
                        setTimeout(() => router.push(dashboardPath), 1500);
                      }}
                      className="flex items-center justify-center h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 transition-colors disabled:opacity-60"
                    >
                      {provider}
                    </button>
                  ))}
                </div>

                <div className="mt-8 text-center text-sm font-semibold text-slate-500">
                  <p>
                    Already have an account?{' '}
                    <Link href="/signin" className="text-[#E62424] hover:underline">
                      Sign In
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="py-12 flex flex-col items-center justify-center text-center gap-6"
              >
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/10">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="font-display text-4xl text-slate-900 mb-2">Registration Successful</h2>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Welcome to Automate. Sourcing your digital dashboard credentials...
                  </p>
                </div>
                <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                    className="h-full bg-green-500 w-1/2"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E62424]"></div>
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  );
}
