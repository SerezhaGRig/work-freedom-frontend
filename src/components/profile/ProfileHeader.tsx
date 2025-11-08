'use client';

import { User, Edit3, Mail, CheckCircle, XCircle } from 'lucide-react';
import { User as UserType } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useI18n } from '@/lib/i18n/i18n-context';

interface ProfileHeaderProps {
  user: UserType;
  onEdit: () => void;
}

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  const { t } = useI18n();
  
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {user.name} {user.surname}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">{user.email}</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              {user.verified ? (
                <Badge variant="success">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {t('profile.verified')}
                </Badge>
              ) : (
                <Badge variant="warning">
                  <XCircle className="w-3 h-3 mr-1" />
                  {t('profile.notVerified')}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <Button onClick={onEdit} variant="secondary">
          <Edit3 className="w-4 h-4" /> {t('profile.editProfile')}
        </Button>
      </div>
    </Card>
  );
}