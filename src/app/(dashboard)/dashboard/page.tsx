'use client';

import { DashboardStats } from '@/components/layout/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/ReactActivity';
import { useAuthStore } from '@/lib/store/authStore';

import { useI18n } from '@/lib/i18n/i18n-context';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { t } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {t('dashboard.title', { name: user?.name })}
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <QuickActions />
        {/* <RecentActivity /> */}
              <DashboardStats />

      </div>
          <p className="mt-8 text-gray-600">
        For suggestions and questions, you can contact me at{' '}
        <a href="mailto:serojjan2000@gmail.com" className="text-blue-600 underline">
          contact me
        </a>.
      </p>
    </div>
  );
}