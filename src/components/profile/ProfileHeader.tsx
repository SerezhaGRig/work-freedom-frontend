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
      <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-20 h-20 flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-800 truncate">
              {user.name} {user.surname}
            </h1>
            <div className="flex items-center space-x-2 mt-1">
              <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-600 truncate text-sm sm:text-base">{user.email}</span>
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
        
        <Button 
          onClick={onEdit} 
          variant="secondary"
          className="w-full sm:w-auto flex-shrink-0"
          size="sm"
        >
          <Edit3 className="w-4 h-4" /> 
          <span className="hidden sm:inline ml-2">{t('profile.editProfile')}</span>
          <span className="sm:hidden ml-2">{t('common.edit')}</span>
        </Button>
      </div>
    </Card>
  );
}