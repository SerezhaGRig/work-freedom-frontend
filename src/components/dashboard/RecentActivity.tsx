'use client';

import { Card } from '@/components/ui/Card';

export function RecentActivity() {
  const activities = [
    { type: 'success', text: 'New proposal accepted', time: '2 hours ago' },
    { type: 'info', text: 'Job post published', time: '5 hours ago' },
    { type: 'message', text: 'New message received', time: '1 day ago' },
  ];

  const colorMap = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    message: 'bg-purple-500',
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
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