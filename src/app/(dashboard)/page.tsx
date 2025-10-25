'use client';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/ReactActivity';
import { DashboardStats } from '@/components/layout/DashboardStats';
import { useAuthStore } from '@/lib/store/authStore';

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome back, {user?.name}!
      </h1>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}