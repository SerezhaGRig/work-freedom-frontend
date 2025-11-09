'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Ban } from 'lucide-react';
import { WorkPost } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { usePosts } from '@/lib/hooks/usePosts';
import { useI18n } from '@/lib/i18n/i18n-context';

interface UpdatePostStatusModalProps {
  isOpen: boolean;
  post: WorkPost;
  onClose: () => void;
  onSuccess: () => void;
}

type PostStatus = 'published' | 'disabled' | 'outdated' | 'blocked';

interface StatusOption {
  value: PostStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export function UpdatePostStatusModal({
  isOpen,
  post,
  onClose,
  onSuccess,
}: UpdatePostStatusModalProps) {
  const { t } = useI18n();
  const { updatePostStatus } = usePosts();
  const [selectedStatus, setSelectedStatus] = useState<PostStatus>(
    post.status?.[0] as PostStatus || 'published'
  );
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions: StatusOption[] = [
    {
      value: 'published',
      label: t('posts.published'),
      description: t('modals.updateStatus.publishedDesc'),
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-green-600 bg-green-50 border-green-200',
    },
    {
      value: 'disabled',
      label: t('posts.disabled'),
      description: t('modals.updateStatus.disabledDesc'),
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-gray-600 bg-gray-50 border-gray-200',
    },
    {
      value: 'outdated',
      label: t('posts.outdated'),
      description: t('modals.updateStatus.outdatedDesc'),
      icon: <Clock className="w-5 h-5" />,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
    },
    {
      value: 'blocked',
      label: t('posts.blocked'),
      description: t('modals.updateStatus.blockedDesc'),
      icon: <Ban className="w-5 h-5" />,
      color: 'text-red-600 bg-red-50 border-red-200',
    },
  ];

  const currentStatus = post.status?.[0] as PostStatus || 'published';

  const handleUpdateStatus = async () => {
    if (selectedStatus === currentStatus) {
      alert(t('modals.updateStatus.noChangeDetected'));
      return;
    }

    setIsLoading(true);
    try {
      await updatePostStatus(post.postId, selectedStatus);
      alert(t('modals.updateStatus.updateSuccess'));
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || t('modals.updateStatus.updateFailed');
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('modals.updateStatus.title')}>
      <div className="space-y-4">
        {/* Current Status */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900 mb-1">
            {t('modals.updateStatus.currentStatus')}
          </p>
          <p className="text-lg font-semibold text-blue-700">
            {statusOptions.find(s => s.value === currentStatus)?.label}
          </p>
        </div>

        {/* Post Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">{post.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{post.description}</p>
        </div>

        {/* Status Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('modals.updateStatus.selectNewStatus')}
          </label>
          <div className="space-y-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedStatus === option.value
                    ? `${option.color} border-current`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={selectedStatus === option.value ? option.color.split(' ')[0] : 'text-gray-400'}>
                    {option.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                  {selectedStatus === option.value && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Warning for status changes */}
        {selectedStatus !== 'published' && selectedStatus !== currentStatus && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>{t('common.warning')}:</strong> {t('modals.updateStatus.visibilityWarning')}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleUpdateStatus}
            disabled={isLoading || selectedStatus === currentStatus}
          >
            {isLoading ? t('modals.updateStatus.updating') : t('modals.updateStatus.updateButton')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}