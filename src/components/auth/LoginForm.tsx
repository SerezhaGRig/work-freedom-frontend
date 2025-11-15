'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Briefcase, User, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/i18n-context';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Card className="w-full max-w-md p-8">
      {/* Language Switcher */}
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">{t('auth.welcomeBack')}</h1>
        <p className="text-gray-600 mt-2">{t('auth.signInToAccount')}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <Input
          label={t('auth.email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          icon={<Mail className="w-5 h-5" />}
        />
        
        <Input
          label={t('auth.password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('auth.password')}
          required
          icon={<User className="w-5 h-5" />}
        />
        
        <Button className="w-full" disabled={isLoading}>
          {isLoading ? t('auth.signingIn') : t('auth.signIn')}
        </Button>
      </form>
      
      <div className="mt-6 space-y-3 text-center">
        <p className="text-gray-600">
          {t('auth.dontHaveAccount')}{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            {t('auth.register')}
          </button>
        </p>
        
      <div className="pt-3 border-t border-gray-200">
      <button
        onClick={() => router.push('/posts')}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 
                    border border-gray-300 rounded-lg text-gray-700 
                    bg-gray-50
                    hover:bg-white-80 font-semibold transition"
        >
        {t('nav.browseJobsWithout')}
      </button>
      </div>
      </div>
    </Card>
  );
}