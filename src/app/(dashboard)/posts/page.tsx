'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, TrendingUp, Target, LogIn, UserPlus, Briefcase, Code } from 'lucide-react';
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
    listCategory,
    isLoading,
    hasMore,
    setListCategory,
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
  const isSearchModeFromURL = !!queryFromURL;

  const [searchQuery, setSearchQuery] = useState(queryFromURL);
  const [isSearchMode, setIsSearchMode] = useState(isSearchModeFromURL);
  const [sortMode, setSortMode] = useState<'recent' | 'match'>(
    isSearchModeFromURL ? 'match' : 'recent'
  );

  // Update URL with current search state
  const updateURL = (query: string, filters: SearchFiltersType, category?: 'IT' | 'Other', preserveScroll = false) => {
    const params = new URLSearchParams();
    
    if (query) params.set('q', query);
    if (category) params.set('listCategory', category);
    if (filters.region) params.set('region', filters.region);
    if (filters.duration) params.set('duration', filters.duration);
    if (filters.category) params.set('category', filters.category);
    if (filters.budgetType) params.set('budgetType', filters.budgetType);
    if (filters.minBudget) params.set('minBudget', filters.minBudget.toString());
    if (filters.maxBudget) params.set('maxBudget', filters.maxBudget.toString());
    
    // Store scroll position in sessionStorage when navigating away
    if (!preserveScroll && typeof window !== 'undefined') {
      sessionStorage.setItem('postsScrollPosition', window.scrollY.toString());
    }
    
    const queryString = params.toString();
    router.replace(`/posts${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  // Load data based on URL params - runs when URL changes
  useEffect(() => {
    const query = searchParams.get('q');
    const category = searchParams.get('listCategory') as 'IT' | 'Other' | null;
    const urlFilters = getFiltersFromURL();
    
    // Update local state to match URL
    setSearchQuery(query || '');
    setIsSearchMode(!!query);
    setSortMode(query ? 'match' : 'recent');
    
    if (query) {
      if (category) {
        setListCategory(category);
      }
      searchPosts(query, urlFilters);
    } else {
      // Clear filters and load posts with optional category
      clearFilters();
      loadPosts(false, category || undefined);
    }
  }, [searchParams]); // Re-run when searchParams changes

  // Restore scroll position when returning to page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedScrollPosition = sessionStorage.getItem('postsScrollPosition');
      if (savedScrollPosition) {
        // Wait for content to load before scrolling
        const timeoutId = setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition));
          sessionStorage.removeItem('postsScrollPosition');
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [posts]); // Run after posts are loaded

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchQuery.trim()) {
      setIsSearchMode(true);
      setSortMode('match');
      const filters = activeFilters;
      searchPosts(searchQuery.trim(), filters);
      updateURL(searchQuery.trim(), filters, listCategory); // ✅ Preserve category in URL
    } else {
      handleClearSearch();
    }
  };

  const handleCategoryFilter = (category: 'IT' | 'Other') => {
    // Toggle category filter
    const newCategory = listCategory === category ? undefined : category;
    loadPosts(false, newCategory);
    updateURL('', {}, newCategory);
  };

  const handleApplyFilters = (filters: SearchFiltersType) => {
    if (searchQuery.trim()) {
      searchPosts(searchQuery.trim(), filters);
      updateURL(searchQuery.trim(), filters, listCategory); // ✅ Preserve category in URL
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchMode(false);
    setSortMode('recent');
    clearFilters();
    
    // Reload posts with the preserved category filter
    loadPosts(false, listCategory);
    router.replace('/posts' + (listCategory ? `?listCategory=${listCategory}` : ''), { scroll: false });
  };

  const handleClearFilters = () => {
    clearFilters();
    if (searchQuery.trim()) {
      searchPosts(searchQuery.trim(), {});
      updateURL(searchQuery.trim(), {});
    }
  };

  const handleLoadMore = () => {
    if (isSearchMode) {
      // For search mode, you'd need to implement search pagination
      // This would require updating the searchPosts function to support loadMore
      console.log('Search pagination not implemented yet');
    } else {
      loadPosts(true, listCategory);
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
        </div>

        {/* Public User Banner */}
        {!isAuthenticated && (
          <Card className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex items-center justify-center gap-4">
              <div
                onClick={() => router.push('/register')}
                className="
                  w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0
                  cursor-pointer hover:bg-blue-700 transition
                "
              >
                <UserPlus className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-600">
                  {t('jobsPage.joinBanner.description')}
                </p>
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

      {/* Category Filter Buttons - Only shown when not in search mode */}
      {!isSearchMode && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              variant={!listCategory ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                loadPosts(false, undefined);
                updateURL('', {}, undefined);
              }}
              className="flex-1 sm:flex-none min-w-0"
            >
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t('jobsPage.categories.all')}</span>
            </Button>
            <Button
              variant={listCategory === 'IT' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleCategoryFilter('IT')}
              className="flex-1 sm:flex-none min-w-0"
            >
              <Code className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">IT</span>
            </Button>
            <Button
              variant={listCategory === 'Other' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleCategoryFilter('Other')}
              className="flex-1 sm:flex-none min-w-0"
            >
              <Briefcase className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{t('jobsPage.categories.other')}</span>
            </Button>
          </div>
        </div>
      )}

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
              {listCategory 
                ? `${t('jobsPage.sorting.showing')} ${listCategory} ${t('jobsPage.sorting.jobs')}`
                : t('jobsPage.sorting.showingRecent')}
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

      {isLoading && posts.length === 0 ? (
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
                : t('jobsPage.results.availableJobs')}
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

          {/* Load More Button */}
          {hasMore && posts.length > 0 && !isSearchMode && (
            <div className="mt-8 text-center">
              <Button
                variant="secondary"
                onClick={handleLoadMore}
                disabled={isLoading}
                className="min-w-[200px]"
              >
                {isLoading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    {t('common.loading')}
                  </>
                ) : (
                  <>{t('common.loadMore')}</>
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}