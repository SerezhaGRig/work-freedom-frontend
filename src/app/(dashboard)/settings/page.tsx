'use client';

import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { Lock, Bell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function SettingsPage() {
  const { t } = useI18n();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert(t('settings.passwordsDoNotMatch'));
      return;
    }
    // TODO: Implement password change
    alert(t('settings.passwordChangedSuccess'));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {t('settings.settingsPage.title')}
      </h1>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">
              {t('settings.changePassword')}
            </h2>
          </div>
          
          <div className="space-y-4">
            <Input
              label={t('settings.currentPassword')}
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder={t('settings.currentPasswordPlaceholder')}
            />
            <Input
              label={t('settings.newPassword')}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('settings.newPasswordPlaceholder')}
            />
            <Input
              label={t('settings.confirmNewPassword')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('settings.confirmPasswordPlaceholder')}
            />
            <Button onClick={handleChangePassword}>
              {t('settings.updatePassword')}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">
              {t('settings.notifications')}
            </h2>
          </div>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-gray-700">
                {t('settings.emailNotifications')}
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-gray-700">
                {t('settings.newProposalAlerts')}
              </span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="rounded" />
              <span className="text-gray-700">
                {t('settings.marketingEmails')}
              </span>
            </label>
          </div>
        </Card>

        <Card className="p-6 border-red-200">
          <div className="flex items-center space-x-3 mb-4">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-red-800">
              {t('settings.dangerZone')}
            </h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            {t('settings.deleteAccountWarning')}
          </p>
          <Button variant="danger">
            {t('settings.deleteAccount')}
          </Button>
        </Card>
      </div>
    </div>
  );
}