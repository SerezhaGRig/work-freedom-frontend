// page(posts).tsx - Updated with dynamic filters

'use client';

import { useEffect, useState } from 'react';
import { Search, TrendingUp, Target } from 'lucide-react';
import { usePosts } from '@/lib/hooks/usePosts';
import { PostList } from '@/components/posts/PostList';
import { SearchFilters } from '@/components/posts/SearchFilters';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SearchFilters as SearchFiltersType } from '@/lib/api/api-client';

export default function PostsPage() {
  const { 
    posts, 
    loadPosts, 
    searchPosts, 
    clearFilters, 
    activeFilters, 
    availableFilters,
    isLoading 
  } = usePosts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [sortMode, setSortMode] = useState<'recent' | 'match'>('recent');

  useEffect(() => {
    // Load all posts on initial mount
    loadPosts();
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchQuery.trim()) {
      setIsSearchMode(true);
      setSortMode('match');
      // Search with current active filters
      searchPosts(searchQuery.trim(), activeFilters);
    } else {
      // If search is empty, go back to listing all posts
      handleClearSearch();
    }
  };

  const handleApplyFilters = (filters: SearchFiltersType) => {
    if (searchQuery.trim()) {
      // Only apply filters if there's a search query
      searchPosts(searchQuery.trim(), filters);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    setSortMode('recent');
    clearFilters();
    loadPosts();
  };

  const handleClearFilters = () => {
    clearFilters();
    if (searchQuery.trim()) {
      // Re-search without filters
      searchPosts(searchQuery.trim(), {});
    }
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const showFilters = isSearchMode && searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Browse Jobs</h1>
        <p className="text-gray-600">
          Find your next opportunity from available job postings
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search jobs by title, skills, or keywords..."
              icon={<Search className="w-5 h-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button disabled={isLoading}>
            Search
          </Button>
        </div>
      </form>

      {/* Dynamic Filters Component - Only shown after search */}
      <SearchFilters
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        activeFilters={activeFilters}
        availableFilters={availableFilters}
        showFilters={showFilters}
      />

      {/* Sort/Filter Info */}
      <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
        {sortMode === 'recent' && !hasActiveFilters ? (
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
            <TrendingUp className="w-4 h-4" />
            <span>
              Showing <span className="font-semibold">most recent</span> job postings
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <Target className="w-4 h-4" />
              <span>
                Showing{' '}
                <span className="font-semibold">
                  {hasActiveFilters ? 'filtered results' : 'best matches'}
                </span>
                {isSearchMode && searchQuery && ` for: "${searchQuery}"`}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearSearch}
            >
              <TrendingUp className="w-4 h-4" />
              Back to Most Recent
            </Button>
          </>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">
            {isSearchMode ? 'Searching...' : 'Loading jobs...'}
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {isSearchMode || hasActiveFilters ? 'Search Results' : 'Available Jobs'} ({posts?.length || 0})
            </h2>
          </div>
          
          {/* Show message if search returned no results */}
          {isSearchMode && posts?.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-600 mb-4">
                Try different keywords or clear your filters
              </p>
              {hasActiveFilters && (
                <Button variant="secondary" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
          
          <PostList posts={posts || []} />
        </div>
      )}
    </div>
  );
}