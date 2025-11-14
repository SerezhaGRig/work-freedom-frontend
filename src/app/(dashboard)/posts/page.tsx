'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, TrendingUp, Target, LogIn, UserPlus } from 'lucide-react';
import { usePosts } from '@/lib/hooks/usePosts';
import { PostList } from '@/components/posts/PostList';
import { SearchFilters } from '@/components/posts/SearchFilters';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SearchFilters as SearchFiltersType } from '@/lib/api/api-client';
import { useAuthStore } from '@/lib/store/authStore';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function PostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { t } = useI18n();
  const { 
    posts, 
    loadPosts, 
    searchPosts, 
    clearFilters, 
    activeFilters, 
    availableFilters,
    isLoading 
  } = usePosts();
  
  // Parse filters from URL
  const getFiltersFromURL = (): SearchFiltersType => {
    const filters: SearchFiltersType = {};
    
    const region = searchParams.get('region');
    const duration = searchParams.get('duration');
    const category = searchParams.get('category');
    const budgetType = searchParams.get('budgetType');
    const minBudget = searchParams.get('minBudget');
    const maxBudget = searchParams.get('maxBudget');
    
    if (region) filters.region = region;
    if (duration) filters.duration = duration as any;
    if (category) filters.category = category as any;
    if (budgetType) filters.budgetType = budgetType as any;
    if (minBudget) filters.minBudget = Number(minBudget);
    if (maxBudget) filters.maxBudget = Number(maxBudget);
    
    return filters;
  };

  // Initialize state from URL - this runs every time searchParams changes
  const queryFromURL = searchParams.get('q') || '';
  const filtersFromURL = getFiltersFromURL();
  const isSearchModeFromURL = !!queryFromURL;

  const [searchQuery, setSearchQuery] = useState(queryFromURL);
  const [isSearchMode, setIsSearchMode] = useState(isSearchModeFromURL);
  const [sortMode, setSortMode] = useState<'recent' | 'match'>(
    isSearchModeFromURL ? 'match' : 'recent'
  );

  // Update URL with current search state
  const updateURL = (query: string, filters: SearchFiltersType) => {
    const params = new URLSearchParams();
    
    if (query) params.set('q', query);
    if (filters.region) params.set('region', filters.region);
    if (filters.duration) params.set('duration', filters.duration);
    if (filters.category) params.set('category', filters.category);
    if (filters.budgetType) params.set('budgetType', filters.budgetType);
    if (filters.minBudget) params.set('minBudget', filters.minBudget.toString());
    if (filters.maxBudget) params.set('maxBudget', filters.maxBudget.toString());
    
    const queryString = params.toString();
    router.replace(`/posts${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  // Load data based on URL params - runs when URL changes
  useEffect(() => {
    const query = searchParams.get('q');
    const urlFilters = getFiltersFromURL();
    
    // Update local state to match URL
    setSearchQuery(query || '');
    setIsSearchMode(!!query);
    setSortMode(query ? 'match' : 'recent');
    
    if (query) {
      searchPosts(query, urlFilters);
    } else {
      loadPosts();
    }
  }, [searchParams]); // Re-run when searchParams changes

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchQuery.trim()) {
      setIsSearchMode(true);
      setSortMode('match');
      const filters = activeFilters;
      searchPosts(searchQuery.trim(), filters);
      updateURL(searchQuery.trim(), filters);
    } else {
      handleClearSearch();
    }
  };

  const handleApplyFilters = (filters: SearchFiltersType) => {
    if (searchQuery.trim()) {
      searchPosts(searchQuery.trim(), filters);
      updateURL(searchQuery.trim(), filters);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    setSortMode('recent');
    clearFilters();
    loadPosts();
    router.replace('/posts', { scroll: false });
  };

  const handleClearFilters = () => {
    clearFilters();
    if (searchQuery.trim()) {
      searchPosts(searchQuery.trim(), {});
      updateURL(searchQuery.trim(), {});
    }
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const showFilters = isSearchMode && searchQuery.trim().length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {t('jobsPage.title')}
            </h1>
            <p className="text-gray-600">
              {t('jobsPage.subtitle')}
            </p>
          </div>
          
          {/* Auth Buttons for Public Users */}
          {!isAuthenticated && (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push('/login')}
              >
                <LogIn className="w-4 h-4" />
                {t('common.login')}
              </Button>
              <Button
                size="sm"
                onClick={() => router.push('/register')}
              >
                <UserPlus className="w-4 h-4" />
                {t('common.signUp')}
              </Button>
            </div>
          )}
        </div>

        {/* Public User Banner */}
        {!isAuthenticated && (
          <Card className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {t('jobsPage.joinBanner.title')}
                </h3>
                <p className="text-gray-600 mb-3">
                  {t('jobsPage.joinBanner.description')}
                </p>
                <div className="flex gap-3">
                  <Button
                    size="sm"
                    onClick={() => router.push('/register')}
                  >
                    {t('jobsPage.joinBanner.createAccount')}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.push('/login')}
                  >
                    {t('jobsPage.joinBanner.haveAccount')}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder={t('jobsPage.searchPlaceholder')}
              icon={<Search className="w-5 h-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button disabled={isLoading}>
            {t('jobsPage.searchButton')}
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
              {t('jobsPage.sorting.showingRecent')}
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <Target className="w-4 h-4" />
              <span>
                Showing{' '}
                <span className="font-semibold">
                  {hasActiveFilters 
                    ? t('jobsPage.sorting.showingFiltered') 
                    : t('jobsPage.sorting.showingMatches')}
                </span>
                {isSearchMode && searchQuery && ` ${t('jobsPage.sorting.for')}: "${searchQuery}"`}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearSearch}
            >
              <TrendingUp className="w-4 h-4" />
              {t('jobsPage.sorting.backToRecent')}
            </Button>
          </>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">
            {isSearchMode ? t('jobsPage.results.searching') : t('jobsPage.results.loadingJobs')}
          </p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">
              {isSearchMode || hasActiveFilters 
                ? t('jobsPage.results.searchResults') 
                : t('jobsPage.results.availableJobs')} ({posts?.length || 0})
            </h2>
          </div>
          
          {/* Show message if search returned no results */}
          {isSearchMode && posts?.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('jobsPage.results.noJobsFound')}
              </h3>
              <p className="text-gray-600 mb-4">
                {t('jobsPage.results.tryDifferentKeywords')}
              </p>
              {hasActiveFilters && (
                <Button variant="secondary" onClick={handleClearFilters}>
                  {t('jobsPage.results.clearFilters')}
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