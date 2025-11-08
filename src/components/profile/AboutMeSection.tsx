'use client';

import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useI18n } from '@/lib/i18n/i18n-context';

interface AboutMeSectionProps {
  aboutMe?: string;
}

export function AboutMeSection({ aboutMe }: AboutMeSectionProps) {
  const { t } = useI18n();
  
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-bold text-gray-800">
          {t('profile.aboutMe')}
        </h2>
      </div>
      
      {aboutMe ? (
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {aboutMe}
        </p>
      ) : (
        <p className="text-gray-500 italic">
          {t('profile.noBioYet')}
        </p>
      )}
    </Card>
  );
}