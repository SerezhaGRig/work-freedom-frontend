'use client';

import { useRouter } from 'next/navigation';
import { Plus, Search, Briefcase, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/i18n-context';

export function QuickActions() {
  const router = useRouter();
  const { t } = useI18n();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        {t('dashboard.quickActions.title')}
      </h2>
      <div className="space-y-3">
        <Button onClick={() => router.push('/my-posts')} className="w-full">
          <Plus className="w-5 h-5" /> {t('dashboard.quickActions.createNewPost')}
        </Button>
        <Button
          onClick={() => router.push('/posts')}
          variant="secondary"
          className="w-full"
        >
          <Search className="w-5 h-5" /> {t('dashboard.quickActions.browseJobs')}
        </Button>
        <Button
          onClick={() => router.push('/my-posts')}
          variant="secondary"
          className="w-full"
        >
          <Briefcase className="w-5 h-5" /> {t('dashboard.quickActions.myPosts')}
        </Button>
        <Button
          onClick={() => router.push('/proposals')}
          variant="secondary"
          className="w-full"
        >
          <FileText className="w-5 h-5" /> {t('dashboard.quickActions.myProposals')}
        </Button>
      </div>
    </Card>
  );
}