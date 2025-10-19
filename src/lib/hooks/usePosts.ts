// usePosts.ts - Updated with dynamic filters support

'use client';

import { useState } from 'react';
import { WorkPost } from '@/types';
import { apiService, SearchFilters, AvailableFilters } from '../api/api-client-mock';

export function usePosts() {
  const [posts, setPosts] = useState<WorkPost[]>([]);
  const [myPosts, setMyPosts] = useState<WorkPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({});
  const [availableFilters, setAvailableFilters] = useState<AvailableFilters | undefined>();

  // List posts with pagination (browse all posts)
  const loadPosts = async (loadMore = false) => {
    setIsLoading(true);
    setError(null);
    setAvailableFilters(undefined); // Clear available filters when browsing
    try {
      const result = await apiService.listPosts(20, loadMore ? nextToken : undefined);
      
      if (loadMore) {
        setPosts([...posts, ...result.posts]);
      } else {
        setPosts(result.posts || []);
      }
      
      setNextToken(result.nextToken);
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
    skills: string[];
    region?: string;
    budget?: { type: 'hourly' | 'fixed'; value: number };
  }) => {
    const newPost = await apiService.createPost(data);
    setMyPosts([newPost, ...myPosts]);
    return newPost;
  };

  const deletePost = async (postId: string) => {
    await apiService.deletePost(postId);
    setMyPosts(myPosts.filter(post => post.postId !== postId));
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
  };

  return {
    posts,
    myPosts,
    isLoading,
    error,
    hasMore: !!nextToken,
    activeFilters,
    availableFilters, // Expose available filters from API
    loadPosts,
    searchPosts,
    clearFilters,
    loadMyPosts,
    createPost,
    deletePost,
    updatePostStatus,
  };
}