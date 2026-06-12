'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, User, Phone, Mail, Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore, UserRole } from '../../store/authStore';
import { useLocalDB } from '../../store/localDB';
import { useToastStore } from '../../store/toastStore';
import { getRoleDashboardPath } from '../../lib/navigation';

// Define Zod signup schema
const signupSchema = z.object({
  name: z.string().min(3, 'Full name is required (min 3 characters)'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  agree: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and privacy policy'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const loginUser = useAuthStore((state) => state.login);
  const registerMechanic = useLocalDB((state) => state.registerMechanic);
  const addToast = useToastStore((state) => state.addToast);
  
  const [role, setRole] = useState<UserRole>('Client');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pwdStrength, setPwdStrength] = useState(0);

  // Initialize React Hook Form with Zod schema resolver
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false,
    }
  });

  const passwordVal = watch('password');

  // Calculate Password Strength
  useEffect(() => {
    let score = 0;
    if (!passwordVal) {
      setPwdStrength(0);
      return;
    }
    if (passwordVal.length >= 6) score += 1;
    if (/[A-Z]/.test(passwordVal)) score += 1;
    if (/[0-9]/.test(passwordVal)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordVal)) score += 1;
    setPwdStrength(score);
  }, [passwordVal]);

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    // Simulate API registration delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    setSuccess(true);
    loginUser(data.email, role, data.name, true);

    // On Mechanic Signup: push profile into the global mechanics registry
    if (role === 'Mechanic') {
      registerMechanic({
        id: 'mc_' + Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        specialization: 'General Automotive Services',
        rating: 5.0,
        garageName: `${data.name}'s Workshop`,
        available: true,
      });
    }

    addToast({ type: 'success', title: 'Account Created!', message: `Welcome to Automate as ${role}.` });

    // Role-aware redirect
    const dashboardPath = getRoleDashboardPath(role);
    setTimeout(() => {
      router.push(dashboardPath);
    }, 1800);
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addToast({ type: 'info', title: 'Terms of Service', message: 'By using Automate, you agree to our standard terms. Full document available upon public launch.' });
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    addToast({ type: 'info', title: 'Privacy Policy', message: 'We protect your data with enterprise-grade encryption. Full policy available upon public launch.' });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-4 sm:p-8 font-sans text-gray-900 overflow-hidden relative">
      {/* Background Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#FF2D2D]/5 to-transparent blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#FF2D2D]/5 to-transparent blur-[120px]" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Back Link */}
        <Link 
          href="/" 
          className="absolute -top-12 left-0 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#FF2D2D] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <Card className="shadow-2xl border border-gray-100 rounded-3xl p-8 bg-white/80 backdrop-blur-md relative overflow-hidden">
          <AnimatePresence mode="wait">
            {!success ? (
              <motion.div
                key="signup-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF2D2D]/10 text-[#FF2D2D] text-xs font-bold uppercase mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Automate Auth
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-1">Create Account</h1>
                  <p className="text-gray-400 text-sm">Join the luxury platform re-engineering car care.</p>
                </div>

                {/* Role Switcher */}
                <div className="mb-6 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 flex gap-2">
                  {(['Client', 'Mechanic', 'Merchant'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                        role === r
                          ? 'bg-[#FF2D2D] text-white shadow-lg shadow-[#FF2D2D]/35'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Ahmed Al-Masri"
                          {...register('name')}
                          disabled={isLoading}
                          className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                            errors.name ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                          }`}
                        />
                        <User className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
                      </div>
                      {errors.name && <p className="text-xs font-bold text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Phone Number</label>
                      <div className="relative">
                        <input
                          type="tel"
                          placeholder="+962 7 9876 5432"
                          {...register('phone')}
                          disabled={isLoading}
                          className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                            errors.phone ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                          }`}
                        />
                        <Phone className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
                      </div>
                      {errors.phone && <p className="text-xs font-bold text-red-500">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="ahmed@example.com"
                        {...register('email')}
                        disabled={isLoading}
                        className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                          errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                        }`}
                      />
                      <Mail className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
                    </div>
                    {errors.email && <p className="text-xs font-bold text-red-500">{errors.email.message}</p>}
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="••••••••"
                          {...register('password')}
                          disabled={isLoading}
                          className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                            errors.password ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                          }`}
                        />
                        <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
                      </div>
                      {errors.password && <p className="text-xs font-bold text-red-500">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Confirm Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="••••••••"
                          {...register('confirmPassword')}
                          disabled={isLoading}
                          className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-gray-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                            errors.confirmPassword ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-[#FF2D2D]/40'
                          }`}
                        />
                        <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
                      </div>
                      {errors.confirmPassword && <p className="text-xs font-bold text-red-500">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {passwordVal && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-gray-400">Password Strength:</span>
                        <span className={
                          pwdStrength <= 1 ? 'text-red-500' : pwdStrength <= 3 ? 'text-amber-500' : 'text-green-500'
                        }>
                          {pwdStrength <= 1 ? 'Weak' : pwdStrength <= 3 ? 'Medium' : 'Ultra Secure'}
                        </span>
                      </div>
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map((step, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              idx < pwdStrength
                                ? pwdStrength <= 1
                                  ? 'bg-red-500'
                                  : pwdStrength <= 3
                                  ? 'bg-amber-500'
                                  : 'bg-green-500'
                                : 'bg-gray-150'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Checkbox Terms */}
                  <div className="flex items-start pt-2">
                    <input
                      id="agree"
                      type="checkbox"
                      {...register('agree')}
                      className="w-4.5 h-4.5 mt-0.5 rounded border-gray-300 focus:ring-red-400 accent-[#FF2D2D] cursor-pointer"
                    />
                    <label htmlFor="agree" className="ml-2.5 text-sm font-semibold text-gray-500 leading-snug cursor-pointer select-none">
                      I agree to the{' '}
                      <button type="button" onClick={handleTermsClick} className="text-[#FF2D2D] hover:underline">Terms of Service</button>
                      {' '}and{' '}
                      <button type="button" onClick={handlePrivacyClick} className="text-[#FF2D2D] hover:underline">Privacy Policy</button>.
                    </label>
                  </div>
                  {errors.agree && <p className="text-xs font-bold text-red-500">{errors.agree.message}</p>}

                  {/* Submit Button */}
                  <div className="pt-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      fullWidth
                      size="lg"
                      className="h-13 bg-[#FF2D2D] hover:bg-red-600 shadow-xl shadow-red-500/20 text-white rounded-xl text-base font-bold flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        `Sign Up as ${role}`
                      )}
                    </Button>
                  </div>
                </form>

                {/* Social Login Divider */}
                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-gray-200"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Or Register With</span>
                  <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Social buttons */}
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
                        loginUser(`${provider.toLowerCase()}@automate.com`, role, `${provider} ${role}`, true);
                        setSuccess(true);
                        addToast({ type: 'success', title: 'Registered!', message: `Account created with ${provider} as ${role}.` });
                        const dashboardPath = getRoleDashboardPath(role);
                        setTimeout(() => router.push(dashboardPath), 1500);
                      }}
                      className="flex items-center justify-center h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-bold text-xs text-gray-700 transition-colors disabled:opacity-60"
                    >
                      {provider}
                    </button>
                  ))}
                </div>

                {/* Footer Switch */}
                <div className="mt-8 text-center text-sm font-semibold text-gray-500">
                  <p>
                    Already have an account?{' '}
                    <Link href="/signin" className="text-[#FF2D2D] hover:underline">
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
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Registration Successful</h2>
                  <p className="text-gray-400 max-w-sm mx-auto">
                    Welcome to Automate. Sourcing your digital dashboard credentials...
                  </p>
                </div>
                <div className="w-12 h-1.5 bg-gray-150 rounded-full overflow-hidden">
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
