'use client';

import { useState, useEffect } from 'react';
import { WorkPost } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { apiService } from '@/lib/api/api-client';
import { useI18n } from '@/lib/i18n/i18n-context';
import { REGIONS } from '@/config/constants';

interface EditPostModalProps {
  isOpen: boolean;
  post: WorkPost;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditPostModal({
  isOpen,
  post,
  onClose,
  onSuccess,
}: EditPostModalProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [region, setRegion] = useState('');
  const [budgetType, setBudgetType] = useState<'hourly' | 'fixed' | 'monthly'>('hourly');
  const [budgetValue, setBudgetValue] = useState('');
  const [duration, setDuration] = useState<'less_than_month' | 'less_than_3_months' | 'more_than_3_months'>('less_than_3_months');
  const [category, setCategory] = useState<'IT' | 'Other'>('IT');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setSkills(post.skills?.join(', ') || '');
      setRegion(post.region || '');
      setBudgetType(post.budget?.type || 'hourly');
      setBudgetValue(post.budget?.value.toString() || '');
      setCategory(post.category || 'IT');

      setDuration(post.duration || 'less_than_3_months');
    }
  }, [post]);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !skills.trim()) {
      alert(t('modals.createPost.fillRequired'));
      return;
    }

    setIsLoading(true);
    try {
      const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(s => s): undefined;
      await apiService.updatePost(post.postId, {
        title,
        description,
        skills: skillsArray,
        region: region || undefined,
        duration,
        category,
        budget: budgetValue ? {
          type: budgetType,
          value: parseFloat(budgetValue)
        } : undefined,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(t('modals.editPost.updateSuccess'));
      onSuccess();
    } catch (error) {
      alert(t('modals.editPost.updateFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.editPost.title')}>
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
        </div>

                <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('modals.createPost.category')} <span className="text-red-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as 'IT' | 'Other')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="IT">{'IT'}</option>
            <option value="Other">{'Other'}</option>
          </select>
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
            {isLoading ? t('modals.editPost.updating') : t('modals.editPost.updateButton')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}