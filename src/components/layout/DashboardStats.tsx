'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Send, MessageCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { usePosts } from '@/lib/hooks/usePosts';
import { useProposals } from '@/lib/hooks/useProposals';
import { useI18n } from '@/lib/i18n/i18n-context';

export function DashboardStats() {
  const { myPosts, loadMyPosts } = usePosts();
  const { myProposals, loadMyProposals } = useProposals();
  const [activeChats, setActiveChats] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadMyPosts(), loadMyProposals()]);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const chats = myProposals.filter(
      p => p.status === 'accepted' || p.status === 'discussion'
    ).length;
    setActiveChats(chats);
  }, [myProposals]);

  const stats = [
    {
      label: t('dashboard.stats.myJobPosts'),
      value: myPosts.length.toString(),
      icon: Briefcase,
      color: 'blue',
    },
    {
      label: t('dashboard.stats.proposalsSent'),
      value: myProposals.length.toString(),
      icon: Send,
      color: 'green',
    },
    {
      label: t('dashboard.stats.activeChats'),
      value: activeChats.toString(),
      icon: MessageCircle,
      color: 'purple',
    },
  ];

  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-16 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${(colorMap as any)[stat.color]} rounded-full flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}