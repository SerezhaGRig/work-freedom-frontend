'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useI18n } from '@/lib/i18n/i18n-context';
import { LOCALE_KEY } from '@/config/constants';

export function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/posts', label: t('nav.browseJobs') },
    { href: '/my-posts', label: t('nav.myPosts') },
    { href: '/proposals', label: t('nav.myProposals') },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">{t('nav.brandName')}</span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <LanguageSwitcher />
            <ProfileDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}