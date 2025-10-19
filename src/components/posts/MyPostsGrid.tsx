'use client';

import { WorkPost } from '@/types';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { MyPostCard } from './MyPostCard';

interface MyPostsGridProps {
  posts: WorkPost[];
  onUpdate: () => void;
}

export function MyPostsGrid({ posts, onUpdate }: MyPostsGridProps) {
  const router = useRouter();

  if (posts.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first job post to start receiving proposals from talented professionals.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <MyPostCard key={post.postId} post={post} onUpdate={onUpdate} />
      ))}
    </div>
  );
}