'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { usePosts } from '@/lib/hooks/usePosts';
import { MyPostsGrid } from '@/components/posts/MyPostsGrid';
import { CreatePostModal } from '@/components/posts/CreatePostModal';
import { Button } from '@/components/ui/Button';

export default function MyPostsPage() {
  const { myPosts, loadMyPosts, isLoading } = usePosts();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadMyPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Posts</h1>
          <p className="text-gray-600 mt-2">
            Manage your job postings and review proposals
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-5 h-5" /> Create New Post
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading your posts...</p>
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