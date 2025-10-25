'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Contact } from '@/types';
import { apiService } from '../api/api-client';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const router = useRouter();
  const { setUser, logout: storeLogout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiService.login(email, password);

      // Map API response to User type
      const user = {
        ...result.user,
        verified: result.user.status === 'confirmed',
      };

      setUser(user);
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(errorMessage);

      // Handle email not verified case
      if (err.response?.status === 403 && err.response?.data?.status === 'pending') {
        setError('Email not verified. Redirecting to verification page...');
        setTimeout(() => router.push('/verify'), 2000);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    name: string;
    surname?: string;
    contacts: Contact[];
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiService.register(data);
      router.push('/verify');
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verify = async (email: string, code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiService.verify(email, code);

      const user = {
        ...result.user,
        verified: true,
        contacts: result.user.contacts || [],
      };

      setUser(user);
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Verification failed. Please check your code.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiService.resendCode(email);
      return { message: 'Verification code resent successfully' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to resend code.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiService.forgotPassword(email);
      return { message: 'If the email exists, a reset code has been sent' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to send reset code.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await apiService.resetPassword(email, code, newPassword);
      router.push('/login');
      return { message: 'Password reset successfully' };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to reset password.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.clearAuth();
    storeLogout();
    router.push('/login');
  };

  return {
    login,
    register,
    verify,
    resendCode,
    forgotPassword,
    resetPassword,
    logout,
    isLoading,
    error,
  };
}