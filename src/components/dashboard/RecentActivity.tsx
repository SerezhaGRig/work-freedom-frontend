'use client';

import { Card } from '@/components/ui/Card';
import { useI18n } from '@/lib/i18n/i18n-context';

export function RecentActivity() {
  const { t } = useI18n();
  
  const activities = [
    { type: 'success', text: t('dashboard.recentActivity.proposalAccepted'), time: t('dashboard.recentActivity.hoursAgo', { count: 2 }) },
    { type: 'info', text: t('dashboard.recentActivity.jobPublished'), time: t('dashboard.recentActivity.hoursAgo', { count: 5 }) },
    { type: 'message', text: t('dashboard.recentActivity.newMessage'), time: t('dashboard.recentActivity.daysAgo', { count: 1 }) },
  ];

  const colorMap = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    message: 'bg-purple-500',
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t('dashboard.recentActivity.title')}
      </h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-2 h-2 ${(colorMap as any)[activity.type]} rounded-full mt-2`}></div>
            <div>
              <p className="text-gray-800">{activity.text}</p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}