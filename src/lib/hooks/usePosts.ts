'use client';

import { useState } from 'react';
import { WorkPost } from '@/types';
import { apiService } from '../api/api-client-mock';

export function usePosts() {
  const [posts, setPosts] = useState<WorkPost[]>([]);
  const [myPosts, setMyPosts] = useState<WorkPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextToken, setNextToken] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async (loadMore = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiService.searchPosts(20, loadMore ? nextToken : undefined);
      
      if (loadMore) {
        setPosts([...posts, ...result.posts]);
      } else {
        setPosts(result.posts || []); // Ensure it's always an array
      }
      
      setNextToken(result.nextToken);
    } catch (error) {
      console.error('Failed to load posts:', error);
      setError('Failed to load posts');
      setPosts([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userPosts = await apiService.getMyPosts();
      setMyPosts(userPosts || []); // Ensure it's always an array
    } catch (error) {
      console.error('Failed to load my posts:', error);
      setError('Failed to load my posts');
      setMyPosts([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const createPost = async (data: {
    title: string;
    description: string;
    skills: string[];
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
    loadPosts,
    loadMyPosts,
    createPost,
    deletePost,
    updatePostStatus,
  };
}