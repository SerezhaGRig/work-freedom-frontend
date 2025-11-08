'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePosts } from '@/lib/hooks/usePosts';
import { MyPostsGrid } from '@/components/posts/MyPostsGrid';
import { CreatePostModal } from '@/components/posts/CreatePostModal';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function MyPostsPage() {
  const { t } = useI18n();
  const { myPosts, loadMyPosts, isLoading } = usePosts();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadMyPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t('nav.myPosts')}</h1>
          <p className="text-gray-600 mt-2">
            {t('myPostsPage.subtitle')}
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="w-5 h-5" /> {t('myPostsPage.createNewPost')}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">{t('myPostsPage.loadingPosts')}</p>
        </div>
      ) : (
        <MyPostsGrid posts={myPosts} onUpdate={loadMyPosts} />
      )}

      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          loadMyPosts();
        }}
      />
    </div>
  );
}