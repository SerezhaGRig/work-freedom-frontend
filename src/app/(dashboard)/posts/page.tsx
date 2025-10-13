'use client';

import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { usePosts } from '@/lib/hooks/usePosts';
import { PostList } from '@/components/posts/PostList';
import { Input } from '@/components/ui/Input';

export default function PostsPage() {
  const { posts, loadPosts, isLoading } = usePosts();

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Jobs</h1>
        <p className="text-gray-600">
          Find your next opportunity from available job postings
        </p>
      </div>

      {/* Search Bar - Optional for future implementation */}
      <div className="mb-6">
        <Input
          placeholder="Search jobs by title, skills, or keywords..."
          icon={<Search className="w-5 h-5" />} value={''} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
            throw new Error('Function not implemented.');
          } }        />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading jobs...</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Available Jobs ({posts?.length || 0})
            </h2>
          </div>
          <PostList posts={posts || []} />
        </div>
      )}
    </div>
  );
}