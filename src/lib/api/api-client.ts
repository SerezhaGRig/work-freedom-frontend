// api-client.ts - Updated with dynamic filters

import axios, { AxiosInstance } from 'axios';
import { User, Contact, WorkPost, Proposal, Message, EditUser } from '@/types';
import { API_URL } from '@/config/constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || API_URL;

// Simplified SearchFilters interface
export interface SearchFilters {
  budgetType?: 'hourly' | 'fixed' | 'monthly';
  minBudget?: number;
  maxBudget?: number;
  region?: string;
}

export interface AvailableFilters {
  regions?: string[];
  budgetTypes?: ('hourly' | 'fixed' | 'monthly' | 'monthly')[];
  minBudget?: number;
  maxBudget?: number;
}

export interface SearchPostsResponse {
  posts: WorkPost[];
  nextToken?: string;
  filters?: AvailableFilters; // Changed from availableFilters to filters
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

    // Add request interceptor to include token
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

  // Post endpoints
  async createPost(data: {
    title: string;
    description: string;
    skills?: string[];
    region?: string;
    budget?: { type: 'hourly' | 'fixed' | 'monthly'; value: number };
  }) {
    const response = await this.client.post('/posts', data);
    return response.data.post;
  }

  async getMyPosts(): Promise<WorkPost[]> {
    const response = await this.client.get('/posts/my-posts');
    return response.data.posts;
  }

// When registering a new user, you can also optionally include aboutMe
async register(data: {
    email: string;
    password: string;
    name: string;
    surname?: string;
    aboutMe?: string; // Add this optional field
    contacts: Contact[];
}) {
    const response = await this.client.post('/auth/register', data);
    return response.data;
}

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
    if (filters.budgetType) {
      body.budgetType = filters.budgetType;
    }

    if (filters.minBudget !== undefined) {
      body.minBudget = filters.minBudget;
    }

    if (filters.maxBudget !== undefined) {
      body.maxBudget = filters.maxBudget;
    }

    if (filters.region) {
      body.region = filters.region;
    }
  }

  const response = await this.client.post('/posts/search', body);
  return response.data;
}

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
    return response
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