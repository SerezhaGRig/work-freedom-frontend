'use client';

import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface AboutMeSectionProps {
  aboutMe?: string;
}

export function AboutMeSection({ aboutMe }: AboutMeSectionProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="w-5 h-5 text-gray-600" />
        <h2 className="text-xl font-bold text-gray-800">About Me</h2>
      </div>
      
      {aboutMe ? (
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {aboutMe}
        </p>
      ) : (
        <p className="text-gray-500 italic">
          No bio added yet. Click "Edit Profile" to tell others about yourself.
        </p>
      )}
    </Card>
  );
}