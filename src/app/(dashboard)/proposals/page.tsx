'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { useProposals } from '@/lib/hooks/useProposals';
import { useRouter } from 'next/navigation';
import { MyProposalsList } from '@/components/proposals/MyProposalList';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function ProposalsPage() {
  const { t } = useI18n();
  const { myProposals, loadMyProposals, isLoading } = useProposals();
  const router = useRouter();

  useEffect(() => {
    loadMyProposals();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t('nav.myProposals')}</h1>
        <p className="text-gray-600 mt-2">
          {t('proposalsPage.subtitle')}
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">{t('proposalsPage.loadingProposals')}</p>
        </div>
      ) : myProposals.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t('proposalsPage.noProposalsTitle')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('proposalsPage.noProposalsDescription')}
            </p>
            <Button onClick={() => router.push('/posts')}>
              {t('proposalsPage.browseJobs')}
            </Button>
          </div>
        </Card>
      ) : (
        <MyProposalsList proposals={myProposals} onUpdate={loadMyProposals} />
      )}
    </div>
  );
}