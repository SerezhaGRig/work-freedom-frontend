// api-client.ts - Fixed with proper response transformation

import axios, { AxiosInstance } from 'axios';
import { Contact, WorkPost, Proposal, Message, EditUser } from '@/types';
import { API_URL } from '@/config/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_URL;

export interface SearchFilters {
  budgetType?: 'hourly' | 'fixed' | 'monthly';
  minBudget?: number;
  maxBudget?: number;
  region?: string;
  duration?: 'less_than_month' | 'less_than_3_months' | 'more_than_3_months';
  category?: 'IT' | 'Other';

}

export interface AvailableFilters {
  regions?: string[];
  budgetTypes?: ('hourly' | 'fixed' | 'monthly')[];
  minBudget?: number;
  maxBudget?: number;
  durations?: ('less_than_month' | 'less_than_3_months' | 'more_than_3_months')[];
  categories?: ('IT' | 'Other')[];
}

export interface SearchPostsResponse {
  posts: WorkPost[];
  nextToken?: string;
  filters?: AvailableFilters;
}

// API response structure (as returned by backend)
interface ApiSearchResponse {
  posts: WorkPost[];
  nextToken?: string;
  filters?: {
    regions?: string[];
    durations?: ('less_than_month' | 'less_than_3_months' | 'more_than_3_months')[];
    categories?: ('IT' | 'Other')[];
    budget?: {
      type?: ('hourly' | 'fixed' | 'monthly')[];
      value?: {
        min: number;
        max: number;
      };
    };
  };
}

class ApiService {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include token only if available
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  private setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearAuth() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Transform API response filters to frontend format
  private transformFilters(apiFilters?: ApiSearchResponse['filters']): AvailableFilters | undefined {
    if (!apiFilters) return undefined;

    const transformed: AvailableFilters = {};

    // Copy regions directly
    if (apiFilters.regions && apiFilters.regions.length > 0) {
      transformed.regions = apiFilters.regions;
    }

    // Copy durations directly
    if (apiFilters.durations && apiFilters.durations.length > 0) {
      transformed.durations = apiFilters.durations;
    }

        if (apiFilters.categories && apiFilters.categories.length > 0) {
      transformed.categories = apiFilters.categories;
    }

    // Transform budget structure
    if (apiFilters.budget) {
      if (apiFilters.budget.type && apiFilters.budget.type.length > 0) {
        transformed.budgetTypes = apiFilters.budget.type;
      }
      if (apiFilters.budget.value) {
        transformed.minBudget = apiFilters.budget.value.min;
        transformed.maxBudget = apiFilters.budget.value.max;
      }
    }

    // Return undefined if no filters are actually available
    if (Object.keys(transformed).length === 0) {
      return undefined;
    }

    return transformed;
  }

  async verify(email: string, code: string) {
    const response = await this.client.post('/auth/verify', { email, code });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async resendCode(email: string) {
    const response = await this.client.post('/auth/resend-code', { email });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    if (response.data.token) {
      this.setToken(response.data.token);
    }
    return response.data;
  }

  async forgotPassword(email: string) {
    const response = await this.client.post('/auth/forgot-password', { email });
    return response.data;
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const response = await this.client.post('/auth/reset-password', {
      email,
      code,
      newPassword,
    });
    return response.data;
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    surname?: string;
    aboutMe?: string;
    contacts: Contact[];
  }) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
  }

  // Post endpoints
  async createPost(data: {
    title: string;
    description: string;
    skills?: string[];
    region?: string;
    budget?: { type: 'hourly' | 'fixed' | 'monthly'; value: number, currency: 'dollar' | 'dram' | 'rubl' };
    duration: 'less_than_month' | 'less_than_3_months' | 'more_than_3_months';
  }) {
    const response = await this.client.post('/posts', data);
    return response.data.post;
  }

  async getMyPosts(): Promise<WorkPost[]> {
    const response = await this.client.get('/posts/my-posts');
    return response.data.posts;
  }

  // PUBLIC ENDPOINT - No authentication required
  async listPosts(limit = 20, nextToken?: string): Promise<{
    posts: WorkPost[];
    nextToken?: string;
  }> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (nextToken) params.append('nextToken', nextToken);
    
    const response = await this.client.get(`/posts/list?${params}`);
    return response.data;
  }

  // PUBLIC ENDPOINT - No authentication required
  async searchPosts(
    query: string,
    filters?: SearchFilters,
    limit = 20,
    nextToken?: string
  ): Promise<SearchPostsResponse> {
    const body: Record<string, unknown> = {
      query: query?.trim() || '',
      limit,
    };

    if (nextToken) {
      body.nextToken = nextToken;
    }

    if (filters) {
      const searchFilters: Record<string, unknown> = {};

      if (filters.region) {
        searchFilters.region = filters.region;
      }

      if (filters.duration) {
        searchFilters.duration = filters.duration;
      }

        if (filters.category) {
        searchFilters.category = filters.category;
      }

      if (filters.budgetType || filters.minBudget !== undefined || filters.maxBudget !== undefined) {
        const budgetFilter: Record<string, unknown> = {};
        
        if (filters.budgetType) {
          budgetFilter.type = filters.budgetType;
        }

        if (filters.minBudget !== undefined || filters.maxBudget !== undefined) {
          budgetFilter.value = {
            min: filters.minBudget ?? 1,
            max: filters.maxBudget ?? 90000000,
          };
        }

        searchFilters.budget = budgetFilter;
      }

      if (Object.keys(searchFilters).length > 0) {
        body.filters = searchFilters;
      }
    }

    const response = await this.client.post<ApiSearchResponse>('/posts/search', body);
    
    // Transform the response to match frontend expectations
    return {
      posts: response.data.posts,
      nextToken: response.data.nextToken,
      filters: this.transformFilters(response.data.filters)
    };
  }

  // PUBLIC ENDPOINT - No authentication required
  async getPost(postId: string): Promise<WorkPost> {
    const response = await this.client.get(`/posts/${postId}`);
    return response.data.post;
  }

  async deletePost(postId: string) {
    const response = await this.client.delete(`/posts/${postId}`);
    return response.data;
  }

  async updatePost(postId: string, body: Partial<WorkPost>) {
    const response = await this.client.patch(`/posts/${postId}`, body);
    return response;
  }
  
  async editUserProfile(body: Partial<EditUser>) {
    const response = await this.client.patch(`/user/profile`, body);
    return response;
  }

  async updatePostStatus(postId: string, status: 'published' | 'disabled' | 'outdated' | 'blocked') {
    const response = await this.client.patch(`/posts/${postId}/status`, { status });
    return response.data;
  }

  // Proposal endpoints
  async sendProposal(postId: string, coverLetter: string) {
    const response = await this.client.post('/proposals', {
      postId,
      coverLetter,
    });
    return response.data.proposal;
  }

  async getProposalsForPost(postId: string, status?: string): Promise<Proposal[]> {
    const params = status ? `?status=${status}` : '';
    const response = await this.client.get(`/proposals/post/${postId}${params}`);
    return response.data.proposals;
  }

  async getMyProposals(): Promise<Proposal[]> {
    const response = await this.client.get('/proposals/my-proposals');
    return response.data.proposals;
  }

  async getProposalDetails(proposalId: string) {
    const response = await this.client.get(`/proposals/${proposalId}/details`);
    return response.data;
  }

  async updateProposalStatus(
    proposalId: string,
    postId: string,
    status: 'accepted' | 'discussion' | 'rejected',
    contacts?: Contact[]
  ) {
    const response = await this.client.patch('/proposals/status', {
      proposalId,
      postId,
      status,
      contacts,
    });
    return response.data;
  }

  // Chat endpoints
  async sendMessage(proposalId: string, message: string) {
    const response = await this.client.post('/chat/message', {
      proposalId,
      message,
    });
    return response.data.data;
  }

  async getMessages(proposalId: string, limit = 50, nextToken?: string): Promise<{
    messages: Message[];
    nextToken?: string;
  }> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (nextToken) params.append('nextToken', nextToken);
    
    const response = await this.client.get(`/chat/messages/${proposalId}?${params}`);
    return response.data;
  }

  async getDiscussion(proposalId: string) {
    const response = await this.client.get(`/chat/discussion/${proposalId}`);
    return response.data.discussion;
  }
}

export const apiService = new ApiService();