'use client';

import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { WorkPost } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { usePosts } from '@/lib/hooks/usePosts';
import { Button } from '../ui/Button';

interface DeletePostModalProps {
  isOpen: boolean;
  post: WorkPost;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeletePostModal({
  isOpen,
  post,
  onClose,
  onSuccess,
}: DeletePostModalProps) {
  const { deletePost } = usePosts();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deletePost(post.postId);
      alert('Post deleted successfully!');
      onSuccess();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete post';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Post">
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900 mb-1">
              Are you sure you want to delete this post?
            </h4>
            <p className="text-sm text-red-700">
              This action cannot be undone. All proposals associated with this post will also be removed.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-1">{post.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {post.description}
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete Post'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}