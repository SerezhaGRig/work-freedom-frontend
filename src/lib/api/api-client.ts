// import axios, { AxiosInstance } from 'axios';
// import { User, Contact, WorkPost, Proposal, Message } from '@/types';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// class ApiService {
//   private client: AxiosInstance;
//   private token: string | null = null;

//   constructor() {
//     this.client = axios.create({
//       baseURL: API_BASE_URL,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     // Add request interceptor to include token
//     this.client.interceptors.request.use((config) => {
//       if (this.token) {
//         config.headers.Authorization = `Bearer ${this.token}`;
//       }
//       return config;
//     });

//     // Load token from localStorage on initialization
//     if (typeof window !== 'undefined') {
//       this.token = localStorage.getItem('authToken');
//     }
//   }

//   private setToken(token: string) {
//     this.token = token;
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('authToken', token);
//     }
//   }

//   clearAuth() {
//     this.token = null;
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('authToken');
//     }
//   }

//   // Auth endpoints
//   async register(data: {
//     email: string;
//     password: string;
//     name: string;
//     surname?: string;
//     contacts: Contact[];
//   }) {
//     const response = await this.client.post('/auth/register', data);
//     return response.data;
//   }

//   async verify(email: string, code: string) {
//     const response = await this.client.post('/auth/verify', { email, code });
//     if (response.data.token) {
//       this.setToken(response.data.token);
//     }
//     return response.data;
//   }

//   async resendCode(email: string) {
//     const response = await this.client.post('/auth/resend-code', { email });
//     return response.data;
//   }

//   async login(email: string, password: string) {
//     const response = await this.client.post('/auth/login', { email, password });
//     if (response.data.token) {
//       this.setToken(response.data.token);
//     }
//     return response.data;
//   }

//   async forgotPassword(email: string) {
//     const response = await this.client.post('/auth/forgot-password', { email });
//     return response.data;
//   }

//   async resetPassword(email: string, code: string, newPassword: string) {
//     const response = await this.client.post('/auth/reset-password', {
//       email,
//       code,
//       newPassword,
//     });
//     return response.data;
//   }

//   // Post endpoints
//   async createPost(data: {
//     title: string;
//     description: string;
//     skills: string[];
//     budget?: { type: 'hourly' | 'fixed'; value: number };
//   }) {
//     const response = await this.client.post('/posts', data);
//     return response.data.post;
//   }

//   async getMyPosts(): Promise<WorkPost[]> {
//     const response = await this.client.get('/posts/my-posts');
//     return response.data.posts;
//   }

//   // GET /posts/list - List all posts with pagination
//   async listPosts(limit = 20, nextToken?: string): Promise<{
//     posts: WorkPost[];
//     nextToken?: string;
//   }> {
//     const params = new URLSearchParams();
//     params.append('limit', limit.toString());
//     if (nextToken) params.append('nextToken', nextToken);
    
//     const response = await this.client.get(`/posts/list?${params}`);
//     return response.data;
//   }

//   // GET /posts/search - Search posts by query
//   async searchPosts(query: string): Promise<{
//     posts: WorkPost[];
//     nextToken?: string;
//   }> {
//     const response = await this.client.get('/posts/search', {
//       data: { query }
//     });
//     return response.data;
//   }

//   async getPost(postId: string): Promise<WorkPost> {
//     const response = await this.client.get(`/posts/${postId}`);
//     return response.data.post;
//   }

//   async deletePost(postId: string) {
//     const response = await this.client.delete(`/posts/${postId}`);
//     return response.data;
//   }

//   async updatePostStatus(postId: string, status: 'published' | 'disabled' | 'outdated' | 'blocked') {
//     const response = await this.client.patch(`/posts/${postId}/status`, { status });
//     return response.data;
//   }

//   // Proposal endpoints
//   async sendProposal(postId: string, coverLetter: string) {
//     const response = await this.client.post('/proposals', {
//       postId,
//       coverLetter,
//     });
//     return response.data.proposal;
//   }

//   async getProposalsForPost(postId: string, status?: string): Promise<Proposal[]> {
//     const params = status ? `?status=${status}` : '';
//     const response = await this.client.get(`/proposals/post/${postId}${params}`);
//     return response.data.proposals;
//   }

//   async getMyProposals(): Promise<Proposal[]> {
//     const response = await this.client.get('/proposals/my-proposals');
//     return response.data.proposals;
//   }

//   async getProposalDetails(proposalId: string, postId: string) {
//     const response = await this.client.get(`/proposals/${proposalId}/post/${postId}/details`);
//     return response.data;
//   }

//   async updateProposalStatus(
//     proposalId: string,
//     postId: string,
//     status: 'accepted' | 'discussion' | 'rejected',
//     contacts?: Contact[]
//   ) {
//     const response = await this.client.patch('/proposals/status', {
//       proposalId,
//       postId,
//       status,
//       contacts,
//     });
//     return response.data;
//   }

//   // Chat endpoints
//   async sendMessage(proposalId: string, message: string) {
//     const response = await this.client.post('/chat/message', {
//       proposalId,
//       message,
//     });
//     return response.data.data;
//   }

//   async getMessages(proposalId: string, limit = 50, nextToken?: string): Promise<{
//     messages: Message[];
//     nextToken?: string;
//   }> {
//     const params = new URLSearchParams();
//     params.append('limit', limit.toString());
//     if (nextToken) params.append('nextToken', nextToken);
    
//     const response = await this.client.get(`/chat/messages/${proposalId}?${params}`);
//     return response.data;
//   }

//   async getDiscussion(proposalId: string) {
//     const response = await this.client.get(`/chat/discussion/${proposalId}`);
//     return response.data.discussion;
//   }
// }

// export const apiService = new ApiService();