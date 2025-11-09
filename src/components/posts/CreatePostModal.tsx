'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { usePosts } from '@/lib/hooks/usePosts';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { REGIONS } from '@/config/constants';
import { useI18n } from '@/lib/i18n/i18n-context';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const { t } = useI18n();
  const { createPost } = usePosts();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [region, setRegion] = useState('');
  const [budgetType, setBudgetType] = useState<'hourly' | 'fixed' | 'monthly'>('hourly');
  const [budgetValue, setBudgetValue] = useState('');
  const [duration, setDuration] = useState<'less_than_month' | 'less_than_3_months' | 'more_than_3_months'>('less_than_3_months');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !skills.trim()) {
      alert(t('modals.createPost.fillRequired'));
      return;
    }

    setIsLoading(true);
    try {
      const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(s => s): undefined;
      await createPost({
        title,
        description,
        skills: skillsArray,
        region: region || undefined,
        duration,
        budget: budgetValue ? {
          type: budgetType,
          value: parseFloat(budgetValue)
        } : undefined,
      });
      
      setTitle('');
      setDescription('');
      setSkills('');
      setRegion('');
      setBudgetValue('');
      setDuration('less_than_3_months');
      onSuccess();
    } catch (error) {
      alert(t('modals.createPost.createFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.createPost.title')}>
      <div className="space-y-4">
        <Input
          label={t('modals.createPost.jobTitle')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('modals.createPost.jobTitlePlaceholder')}
          required
        />
        
        <TextArea
          label={t('modals.createPost.description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('modals.createPost.descriptionPlaceholder')}
          required
          rows={6}
        />
        
        <Input
          label={t('modals.createPost.requiredSkills')}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder={t('modals.createPost.skillsPlaceholder')}
        />
        
        {/* Region Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('modals.createPost.region')}
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('modals.createPost.selectRegion')}</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {t('modals.createPost.regionHint')}
          </p>
        </div>

        {/* Duration Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('modals.createPost.duration')} <span className="text-red-500">*</span>
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value as 'less_than_month' | 'less_than_3_months' | 'more_than_3_months')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="less_than_month">{t('modals.createPost.lessThanMonth')}</option>
            <option value="less_than_3_months">{t('modals.createPost.lessThan3Months')}</option>
            <option value="more_than_3_months">{t('modals.createPost.moreThan3Months')}</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {t('modals.createPost.durationHint')}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('modals.createPost.budgetType')}
            </label>
            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value as 'hourly' | 'fixed' | 'monthly')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="hourly">{t('modals.createPost.hourlyRate')}</option>
              <option value="fixed">{t('modals.createPost.fixedPrice')}</option>
              <option value="monthly">{t('modals.createPost.monthlyPrice')}</option>
            </select>
          </div>
          
          <Input
            label={t('modals.createPost.budgetValue')}
            type="number"
            value={budgetValue}
            onChange={(e) => setBudgetValue(e.target.value)}
            placeholder={t('modals.createPost.budgetPlaceholder')}
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? t('modals.createPost.creating') : t('modals.createPost.createButton')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}