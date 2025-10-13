'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '../ui/Button';

export function VerifyForm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const { verify, resendCode, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await verify(email, code);
  };

  const handleResend = async () => {
    if (!email) {
      alert('Please enter your email first');
      return;
    }
    
    setResendLoading(true);
    try {
      const result = await resendCode(email);
      alert(result.message);
    } catch (err) {
      // Error handled by hook
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Verify Your Email</h1>
        <p className="text-gray-600 mt-2">
          Enter the 6-digit code sent to your email
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        
        <Input
          label="Verification Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          required
        />
        
        <Button className="w-full" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          className="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50"
        >
          {resendLoading ? 'Sending...' : 'Resend Code'}
        </button>
      </div>
    </Card>
  );
}