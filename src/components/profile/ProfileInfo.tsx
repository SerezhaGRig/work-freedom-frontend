'use client';

import { User, Mail, Calendar, Briefcase, Award } from 'lucide-react';
import { User as UserType } from '@/types';
import { Card } from '@/components/ui/Card';

interface ProfileInfoProps {
  user: UserType;
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const infoItems = [
    {
      icon: User,
      label: 'Full Name',
      value: `${user.name} ${user.surname || ''}`.trim(),
    },
    {
      icon: Mail,
      label: 'Email Address',
      value: user.email,
    },
    {
      icon: Calendar,
      label: 'Member Since',
      value: new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    },
    {
      icon: Briefcase,
      label: 'Active Posts',
      value: '0 posts',
    },
    {
      icon: Award,
      label: 'Proposals Sent',
      value: '0 proposals',
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
      
      <div className="space-y-4">
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className="font-medium text-gray-800">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}