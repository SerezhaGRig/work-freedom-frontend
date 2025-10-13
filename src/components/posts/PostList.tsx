'use client';

import { WorkPost } from '@/types';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: WorkPost[];
}

export function PostList({ posts }: PostListProps) {
  // Add safety check
  if (!posts || !Array.isArray(posts)) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Unable to load posts</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <div className="text-6xl mb-4">💼</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No jobs available
        </h3>
        <p className="text-gray-500">
          Check back later for new opportunities
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.postId} post={post} />
      ))}
    </div>
  );
}