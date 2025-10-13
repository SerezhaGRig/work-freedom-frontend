'use client';

import { useRouter } from 'next/navigation';
import { WorkPost } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '../ui/Badge';

interface MyPostsListProps {
  posts: WorkPost[];
}

export function MyPostsList({ posts }: MyPostsListProps) {
  const router = useRouter();

  const handleViewProposals = (post: WorkPost) => {
    router.push(`/proposals?postId=${post.postId}&postTitle=${encodeURIComponent(post.title)}`);
  };

  if (posts.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8 text-sm">
        You haven't created any posts yet
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.postId} className="p-4">
          <h3 className="font-semibold text-gray-800">{post.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {post.description}
          </p>
          <div className="flex justify-between items-center mt-4">
            <Badge variant="success">Active</Badge>
            <button
              onClick={() => handleViewProposals(post)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Proposals
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}