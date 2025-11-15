'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { useAuthStore } from '@/lib/store/authStore';
import { useI18n } from '@/lib/i18n/i18n-context';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { LogIn, UserPlus } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const { t } = useI18n();

  const isPublicPostPage = pathname?.startsWith('/posts/') && pathname !== '/posts';
  const isPublicPage = isPublicPostPage || pathname === '/posts';

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated && !isPublicPage) {
      router.push('/login');
    }
  }, [_hasHydrated, isAuthenticated, router, isPublicPage]);

  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  if (isPublicPage && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <nav className="bg-white shadow-lg border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2 sm:space-x-8 min-w-0 flex-1">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base md:text-xl font-bold text-gray-800 truncate">{t('nav.brandName')}</span>
                </div>
              </div>
            
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <LanguageSwitcher />
                
                {/* Login Button */}
                <button
                  onClick={() => router.push('/login')}
                  className="px-2 sm:px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 sm:gap-2"
                >
                  <LogIn className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{t('common.login')}</span>
                </button>
                
                {/* Sign Up Button */}
                <button
                  onClick={() => router.push('/register')}
                  className="px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 sm:gap-2"
                >
                  <UserPlus className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{t('common.signUp')}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}