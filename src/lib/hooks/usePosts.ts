// usePosts.ts - Enhanced with caching and pagination support

'use client';

import { useState, useEffect } from 'react';
import { WorkPost } from '@/types';
import { apiService, SearchFilters, AvailableFilters } from '../api/api-client';

const CACHE_KEY = 'posts_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CachedData {
  posts: WorkPost[];
  timestamp: number;
  listCategory?: 'IT' | 'Other';
  nextToken?: string;
}

export function usePosts() {
  const [posts, setPosts] = useState<WorkPost[]>([]);
  const [myPosts, setMyPosts] = useState<WorkPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters | undefined>();
  const [listCategory, setListCategory] = useState<'IT' | 'Other' | undefined>();

  // Load cached posts on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const cachedData: CachedData = JSON.parse(cached);
          const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
          
          if (!isExpired) {
            setPosts(cachedData.posts);
            setListCategory(cachedData.listCategory);
            setNextToken(cachedData.nextToken);
          } else {
            sessionStorage.removeItem(CACHE_KEY);
          }
        } catch (e) {
          sessionStorage.removeItem(CACHE_KEY);
        }
      }
    }
  }, []);

  // Cache posts when they change
  const cachePosts = (newPosts: WorkPost[], category?: 'IT' | 'Other', token?: string) => {
    if (typeof window !== 'undefined') {
      const cacheData: CachedData = {
        posts: newPosts,
        timestamp: Date.now(),
        listCategory: category,
        nextToken: token,
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    }
  };

  // List posts with pagination (browse all posts)
  const loadPosts = async (loadMore = false, category?: 'IT' | 'Other') => {
    setIsLoading(true);
    setError(null);
    setAvailableFilters(undefined); // Clear available filters when browsing
    try {
      const result = await apiService.listPosts(20, loadMore ? nextToken : undefined, category);
      
      let updatedPosts: WorkPost[];
      if (loadMore) {
        updatedPosts = [...posts, ...result.posts];
        setPosts(updatedPosts);
      } else {
        updatedPosts = result.posts || [];
        setPosts(updatedPosts);
      }
      
      setNextToken(result.nextToken);
      setListCategory(category);
      
      // Cache the results
      cachePosts(updatedPosts, category, result.nextToken);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError('Failed to load posts');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Search posts by query with filters - receives filters object from API
  const searchPosts = async (query: string, filters?: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiService.searchPosts(query, filters);
      setPosts(result.posts || []);
      setNextToken(result.nextToken);
      
      // Store filters object directly from API response
      setAvailableFilters(result.filters);
      
      if (filters) {
        setActiveFilters(filters);
      }
    } catch (error) {
      console.error('Failed to search posts:', error);
      setError('Failed to search posts');
      setPosts([]);
      setAvailableFilters(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all filters and reload
  const clearFilters = () => {
    setActiveFilters({});
    setListCategory(undefined);
  };

  // Clear cache manually
  const clearCache = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(CACHE_KEY);
    }
  };

  const loadMyPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userPosts = await apiService.getMyPosts();
      setMyPosts(userPosts || []);
    } catch (error) {
      console.error('Failed to load my posts:', error);
      setError('Failed to load my posts');
      setMyPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (data: {
    title: string;
    description: string;
    skills?: string[];
    region?: string;
    category: 'IT' | 'Other';
    duration: 'less_than_month' | 'less_than_3_months' | 'more_than_3_months';
    budget?: { type: 'hourly' | 'fixed' | 'monthly'; value: number, currency:  'dram' | 'dollar' | 'rubl'  };
  }) => {
    const newPost = await apiService.createPost(data);
    setMyPosts([newPost, ...myPosts]);
    clearCache(); // Clear cache since new post was created
    return newPost;
  };

  const deletePost = async (postId: string) => {
    await apiService.deletePost(postId);
    setMyPosts(myPosts.filter(post => post.postId !== postId));
    clearCache(); // Clear cache since post was deleted
  };

  const updatePostStatus = async (
    postId: string,
    status: 'published' | 'disabled' | 'outdated' | 'blocked'
  ) => {
    await apiService.updatePostStatus(postId, status);
    setMyPosts(
      myPosts.map(post =>
        post.postId === postId ? { ...post, status: [status] } : post
      )
    );
    clearCache(); // Clear cache since post status changed
  };

  return {
    posts,
    myPosts,
    isLoading,
    error,
    hasMore: !!nextToken,
    activeFilters,
    availableFilters, // Expose available filters from API
    listCategory, // Expose active list category
    setListCategory,
    loadPosts,
    searchPosts,
    clearFilters,
    clearCache,
    loadMyPosts,
    createPost,
    deletePost,
    updatePostStatus,
  };
}