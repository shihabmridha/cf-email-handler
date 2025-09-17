'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, Lock, KeyRound, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

enum LoginState {
  LOGIN,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
}

export default function HomePage() {
  const [loginState, setLoginState] = useState<LoginState>(LoginState.LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await apiClient.isAuthenticated();
      if (isAuthenticated) {
        router.push('/compose');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await apiClient.login({ email, password });
      apiClient.setAuthToken(response.token);
      router.push('/compose');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred during login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!passphrase) {
      setError('Please enter your passphrase');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Placeholder forgot password logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoginState(LoginState.RESET_PASSWORD);
    } catch {
      setError('Invalid passphrase');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Placeholder reset password logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoginState(LoginState.LOGIN);
      setError('');
      setEmail('');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPassphrase('');
    } catch {
      setError('Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-700/20 w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          </div>
          <Skeleton className="h-8 w-48 mx-auto mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-float-slow"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl animate-float-slower animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl animate-float-slowest animation-delay-4000"></div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-700/20 w-full max-w-md relative z-10 transition-all duration-300 hover:shadow-2xl">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Email Platform
          </h1>
          <p className="text-sm text-slate-400">
            {loginState === LoginState.LOGIN && "Sign in to your account"}
            {loginState === LoginState.FORGOT_PASSWORD && "Enter your passphrase to continue"}
            {loginState === LoginState.RESET_PASSWORD && "Create a new password"}
          </p>
        </div>

        {loginState === LoginState.LOGIN && (
          <>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address (e.g., john@example.com)"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="pl-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-all duration-200 input-focus-glow"
                  disabled={isSubmitting}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (minimum 6 characters)"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-all duration-200 input-focus-glow"
                  disabled={isSubmitting}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isSubmitting}
              className="w-full h-12 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 btn-gradient-hover"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => { setLoginState(LoginState.FORGOT_PASSWORD); setError(''); }}
                className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
              >
                Forgot your password?
              </button>
            </div>
          </>
        )}

        {loginState === LoginState.FORGOT_PASSWORD && (
          <>
            <div className="space-y-4">
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  id="passphrase"
                  type="text"
                  placeholder="Recovery passphrase provided during setup"
                  value={passphrase}
                  onChange={(e) => { setPassphrase(e.target.value); setError(''); }}
                  className="pl-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-all duration-200 input-focus-glow"
                  disabled={isSubmitting}
                  onKeyPress={(e) => e.key === 'Enter' && handleForgotPassword()}
                />
              </div>
            </div>

            <Button
              onClick={handleForgotPassword}
              disabled={isSubmitting}
              className="w-full h-12 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 btn-gradient-hover"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Continue'
              )}
            </Button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => { setLoginState(LoginState.LOGIN); setError(''); }}
                className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-slate-300 font-medium transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </>
        )}

        {loginState === LoginState.RESET_PASSWORD && (
          <>
            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Create a strong password (min. 6 characters)"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-all duration-200 input-focus-glow"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Type the same password again to confirm"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  className="pl-11 pr-11 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg transition-all duration-200 input-focus-glow"
                  disabled={isSubmitting}
                  onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleResetPassword}
              disabled={isSubmitting}
              className="w-full h-12 mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 btn-gradient-hover"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Resetting...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </Button>

            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => { setLoginState(LoginState.LOGIN); setError(''); }}
                className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-slate-300 font-medium transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-800/30 rounded-lg flex items-center space-x-3 text-red-400 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}


