'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Mail, Lock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import { Logo } from '../../components/ui/Logo';
import axios from 'axios';

// Define Zod signin schema
const signinSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SigninFormValues = z.infer<typeof signinSchema>;

function SigninPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const loginUser = useAuthStore((state) => state.login);
  const addToast = useToastStore((state) => state.addToast);
  
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  // Initialize React Hook Form with Zod schema resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: SigninFormValues) => {
    setIsLoading(true);
    
    try {
      // Connect to the backend API via Axios
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || '/api'}/auth/login`, {
        email: data.email,
        password: data.password,
      });

      setIsLoading(false);
      setSuccess(true);
      
      // Update the Zustand authStore (modify this if the BE returns specific user/token data)
      loginUser(data.email);

      // Retrieve user session profile returned by successful authentication
      const user = useAuthStore.getState().user;
      if (user) {
        addToast({ type: 'success', title: 'Welcome Back!', message: 'Signed in successfully.' });

        // Implement switch case router on login landing callback
        setTimeout(() => {
          const roleUpper = user.role.toUpperCase();
          switch (roleUpper) {
            case 'CLIENT':
              router.push(callbackUrl || '/dashboard');
              break;
            case 'MECHANIC':
              router.push('/dashboard/mechanic');
              break;
            case 'MERCHANT':
              router.push('/dashboard/merchant');
              break;
            default:
              router.push('/dashboard');
          }
        }, 1500);
      }
    } catch (error: any) {
      setIsLoading(false);
      // Handle error gracefully via toast
      addToast({ 
        type: 'error', 
        title: 'Authentication Failed', 
        message: error.response?.data?.message || 'Invalid email or password. Please try again.' 
      });
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Target recovery email payload:', { email: recoveryEmail });
    setResetSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 font-sans text-slate-900 overflow-hidden relative">
      {/* Background Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-[#E62424]/5 to-transparent blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-[#E62424]/5 to-transparent blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
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
                key="login-form"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <Logo showText={false} />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E62424]/10 text-[#E62424] text-xs font-bold uppercase mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Automate Auth
                  </div>
                  <h1 className="font-display text-4xl text-slate-900 mb-1">
                    {isForgotPassword ? "Reset your password" : "Welcome Back"}
                  </h1>
                  <p className="text-slate-500 text-sm">
                    {isForgotPassword 
                      ? "Enter your email address and we'll send you a link to reset your password." 
                      : "Sign in to manage your premium cars & services."}
                  </p>
                </div>

                {isForgotPassword ? (
                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    {resetSent && (
                      <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm font-semibold mb-2">
                        If that account exists, a reset link has been sent!
                      </div>
                    )}
                    
                    {/* Email Address */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                      <input
                        type="email"
                        placeholder="ahmed@example.com"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        required
                        className="w-full h-12 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm font-semibold input-brand-focus"
                      />
                    </div>

                    {/* CTA Button */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        className="w-full h-12 bg-[#E62424] hover:bg-[#d01f1f] text-white font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center"
                      >
                        Send Reset Link
                      </button>
                    </div>

                    {/* Back Navigation */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setResetSent(false);
                      }}
                      className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-center block mt-4 mx-auto bg-transparent border-none outline-none"
                    >
                      Back to login
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email */}
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
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                        <span
                          onClick={() => setIsForgotPassword(true)}
                          className="text-slate-500 hover:text-[#E62424] text-xs transition-colors cursor-pointer font-semibold"
                        >
                          Forgot password?
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="••••••••"
                          {...register('password')}
                          disabled={isLoading}
                          className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-slate-50/50 text-sm font-semibold outline-none transition-colors disabled:opacity-60 ${
                            errors.password ? 'border-red-400 focus:border-red-400' : 'border-slate-200 focus:border-[#E62424]/40'
                          }`}
                        />
                        <Lock className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-400" />
                      </div>
                      {errors.password && <p className="text-xs font-bold text-red-500">{errors.password.message}</p>}
                    </div>

                    {/* Options row */}
                    <div className="flex items-center justify-between pt-1 select-none">
                      <div className="flex items-center">
                        <input
                          id="rememberMe"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4.5 h-4.5 rounded border-slate-300 focus:ring-red-400 accent-[#E62424] cursor-pointer"
                        />
                        <label htmlFor="rememberMe" className="ml-2.5 text-sm font-semibold text-slate-500 cursor-pointer">
                          Remember me
                        </label>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        fullWidth
                        size="lg"
                        className="h-13 bg-brand hover:bg-brand-dark shadow-xl shadow-brand/20 text-white rounded-xl text-base font-bold flex items-center justify-center"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Social Login Divider */}
                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or Continue With</span>
                  <div className="flex-grow border-t border-slate-200"></div>
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
                        loginUser(`${provider.toLowerCase()}@automate.com`);
                        setSuccess(true);
                        addToast({ type: 'success', title: 'Welcome!', message: `Signed in with ${provider}.` });
                        
                        const user = useAuthStore.getState().user;
                        if (user) {
                          setTimeout(() => {
                            const roleUpper = user.role.toUpperCase();
                            switch (roleUpper) {
                              case 'CLIENT':
                                router.push(callbackUrl || '/dashboard');
                                break;
                              case 'MECHANIC':
                                router.push('/dashboard/mechanic');
                                break;
                              case 'MERCHANT':
                                router.push('/dashboard/merchant');
                                break;
                              default:
                                router.push('/dashboard');
                            }
                          }, 1500);
                        }
                      }}
                      className="flex items-center justify-center h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-xs text-slate-700 transition-colors disabled:opacity-60"
                    >
                      {provider}
                    </button>
                  ))}
                </div>

                {/* Footer Switch */}
                <div className="mt-8 text-center text-sm font-semibold text-slate-500">
                  <p>
                    Don&apos;t have an account yet?{' '}
                    <Link href="/signup" className="text-[#E62424] hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="login-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="py-12 flex flex-col items-center justify-center text-center gap-6"
              >
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/10 animate-bounce">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="font-display text-4xl text-slate-900 mb-2">Welcome Back</h2>
                  <p className="text-slate-500 max-w-sm mx-auto font-medium">
                    Authentication complete. Preparing your dashboard workspace...
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

export default function SigninPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E62424]"></div>
      </div>
    }>
      <SigninPageContent />
    </Suspense>
  );
}
