// import { User, Contact, WorkPost, Proposal, Message, ProposalDiscussion, EditUser } from '@/types';

// // Search filters interface
// export interface SearchFilters {
//   budgetType?: 'hourly' | 'fixed' | 'monthly';
//   minBudget?: number;
//   maxBudget?: number;
//   region?: string;
// }

// export interface AvailableFilters {
//   regions?: string[];
//   budgetTypes?: ('hourly' | 'fixed' | 'monthly')[];
//   minBudget?: number;
//   maxBudget?: number;
// }

// export interface SearchPostsResponse {
//   posts: WorkPost[];
//   nextToken?: string;
//   filters?: AvailableFilters;
// }

// // Mock data storage
// class MockDataStore {
//   private users: Map<string, User & { password: string; verificationCode?: string }> = new Map();
//   private posts: Map<string, WorkPost> = new Map();
//   private proposals: Map<string, Proposal> = new Map();
//   private messages: Map<string, Message[]> = new Map();
//   private discussions: Map<string, ProposalDiscussion> = new Map();
//   private currentUserId: string | null = null;

//   constructor() {
//     this.seedData();
//   }

//   private seedData() {
//     // Seed some test users with aboutMe field
//     const user1: User & { password: string } = {
//       id: 'user-1',
//       email: 'john@example.com',
//       name: 'John',
//       surname: 'Doe',
//       aboutMe: 'Senior Full Stack Developer with 7+ years of experience in building scalable web applications. Passionate about React, Node.js, and cloud technologies. I love solving complex problems and mentoring junior developers.',
//       verified: true,
//       status: 'confirmed',
//       password: 'password123',
//       contacts: [
//         { type: 'email', value: 'john@example.com', show: true },
//         { type: 'phone', value: '+1234567890', show: true },
//       ],
//     };

//     const user2: User & { password: string } = {
//       id: 'user-2',
//       email: 'jane@example.com',
//       name: 'Jane',
//       surname: 'Smith',
//       aboutMe: 'Product Manager and UX enthusiast with a background in software development. I bridge the gap between technical teams and business stakeholders to deliver user-centered solutions.',
//       verified: true,
//       status: 'confirmed',
//       password: 'password123',
//       contacts: [
//         { type: 'email', value: 'jane@example.com', show: true },
//         { type: 'whatsapp', value: '+9876543210', show: true },
//       ],
//     };

//     const user3: User & { password: string } = {
//       id: 'user-3',
//       email: 'bob@example.com',
//       name: 'Bob',
//       surname: 'Johnson',
//       aboutMe: 'DevOps Engineer specializing in cloud infrastructure and CI/CD pipelines. AWS certified with expertise in Docker, Kubernetes, and Infrastructure as Code.',
//       verified: true,
//       status: 'confirmed',
//       password: 'password123',
//       contacts: [
//         { type: 'email', value: 'bob@example.com', show: true },
//         { type: 'web', value: 'https://bobjohnson.dev', show: true },
//       ],
//     };

//     this.users.set(user1.id, user1);
//     this.users.set(user2.id, user2);
//     this.users.set(user3.id, user3);

//     const post1: WorkPost = {
//       userId: 'user-2',
//       postId: 'post-1',
//       title: 'Senior Full Stack Developer',
//       description: 'We are looking for an experienced full stack developer to join our team. Must have 5+ years of experience with React, Node.js, and PostgreSQL.',
//       skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS'],
//       status: ['published'],
//       date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
//       publicationDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
//       region: 'North America',
//       budget: { type: 'hourly', value: 75 },
//     };

//     const post2: WorkPost = {
//       userId: 'user-2',
//       postId: 'post-2',
//       title: 'UI/UX Designer for Mobile App',
//       description: 'Looking for a talented UI/UX designer to redesign our mobile application. Experience with Figma required.',
//       skills: ['Figma', 'UI/UX Design', 'Mobile Design', 'Prototyping'],
//       status: ['published'],
//       date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//       publicationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//       region: 'Europe',
//       budget: { type: 'fixed', value: 3000 },
//     };

//     const post3: WorkPost = {
//       userId: 'user-3',
//       postId: 'post-3',
//       title: 'Backend Developer - Python/Django',
//       description: 'Need a backend developer experienced with Python and Django to build REST APIs for our platform.',
//       skills: ['Python', 'Django', 'REST API', 'PostgreSQL', 'Docker'],
//       status: ['published'],
//       date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//       publicationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//       region: 'Asia',
//       budget: { type: 'hourly', value: 60 },
//     };

//     const post4: WorkPost = {
//       userId: 'user-3',
//       postId: 'post-4',
//       title: 'DevOps Engineer',
//       description: 'Seeking a DevOps engineer to help set up CI/CD pipelines and manage our cloud infrastructure.',
//       skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
//       status: ['published'],
//       date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//       publicationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//       region: 'Remote',
//       budget: { type: 'hourly', value: 80 },
//     };

//     const post5: WorkPost = {
//       userId: 'user-3',
//       postId: 'post-5',
//       title: 'DevOps Engineer No skills required',
//       description: 'Seeking a DevOps engineer to help set up CI/CD pipelines and manage our cloud infrastructure.',
//       status: ['published'],
//       date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//       publicationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//       budget: { type: 'hourly', value: 80 },
//     };

//     this.posts.set(post1.postId, post1);
//     this.posts.set(post2.postId, post2);
//     this.posts.set(post3.postId, post3);
//     this.posts.set(post4.postId, post4);
//     this.posts.set(post5.postId, post5);

//     // Seed some proposals
//     const proposal1: Proposal = {
//       userId: 'user-1',
//       proposalId: 'proposal-1',
//       postId: 'post-1',
//       user: {
//         id: 'user-1',
//         email: 'john@example.com',
//         name: 'John Doe',
//         type: 'sender',
//       },
//       date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
//       coverLetter: 'I have over 7 years of experience in full stack development with React and Node.js. I have worked on several large-scale applications and am confident I can deliver high-quality work for your project.',
//       status: 'accepted',
//     };

//     const proposal2: Proposal = {
//       userId: 'user-1',
//       proposalId: 'proposal-2',
//       postId: 'post-3',
//       user: {
//         id: 'user-1',
//         email: 'john@example.com',
//         name: 'John Doe',
//         type: 'sender',
//       },
//       date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
//       coverLetter: 'While my primary expertise is in JavaScript, I have also worked with Python and Django on several projects. I would love to discuss how I can help with your backend development needs.',
//       status: 'invited',
//     };

//     const proposal3: Proposal = {
//       userId: 'user-3',
//       proposalId: 'proposal-3',
//       postId: 'post-1',
//       user: {
//         id: 'user-3',
//         email: 'bob@example.com',
//         name: 'Bob Johnson',
//         type: 'sender',
//       },
//       date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//       coverLetter: 'I am a full stack developer with 5 years of experience. I specialize in React and Node.js and have built multiple production applications. I am excited about this opportunity.',
//       status: 'invited',
//     };

//     this.proposals.set(proposal1.proposalId, proposal1);
//     this.proposals.set(proposal2.proposalId, proposal2);
//     this.proposals.set(proposal3.proposalId, proposal3);

//     // Seed some messages for accepted proposal
//     const messages1: Message[] = [
//       {
//         proposalId: 'proposal-1',
//         messageId: 'msg-1',
//         user: {
//           id: 'user-2',
//           email: 'jane@example.com',
//           name: 'Jane Smith',
//         },
//         date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
//         message: 'Hi John! Thanks for your proposal. I\'d love to discuss the project further. When would you be available for a call?',
//       },
//       {
//         proposalId: 'proposal-1',
//         messageId: 'msg-2',
//         user: {
//           id: 'user-1',
//           email: 'john@example.com',
//           name: 'John Doe',
//         },
//         date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
//         message: 'Hi Jane! I\'m available tomorrow afternoon or Friday morning. What works best for you?',
//       },
//       {
//         proposalId: 'proposal-1',
//         messageId: 'msg-3',
//         user: {
//           id: 'user-2',
//           email: 'jane@example.com',
//           name: 'Jane Smith',
//         },
//         date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
//         message: 'Friday morning works great! Let\'s schedule for 10 AM. I\'ll send you a meeting link.',
//       },
//     ];

//     this.messages.set('proposal-1', messages1);

//     // Seed discussion
//     const discussion1: ProposalDiscussion = {
//       proposalId: 'proposal-1',
//       userId: 'user-1',
//       postId: 'post-1',
//       date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
//       shownContacts: [
//         { type: 'email', value: 'jane@example.com', show: true },
//         { type: 'whatsapp', value: '+9876543210', show: true },
//       ],
//     };

//     this.discussions.set('proposal-1', discussion1);
//   }

//   getUsers() {
//     return this.users;
//   }

//   getPosts() {
//     return this.posts;
//   }

//   getProposals() {
//     return this.proposals;
//   }

//   getMessages() {
//     return this.messages;
//   }

//   getDiscussions() {
//     return this.discussions;
//   }

//   setCurrentUserId(userId: string | null) {
//     this.currentUserId = userId;
//   }

//   getCurrentUserId() {
//     return this.currentUserId;
//   }
// }

// const store = new MockDataStore();

// export class ApiServiceMock {
//   private token: string | null = null;

//   constructor() {
//     if (typeof window !== 'undefined') {
//       this.token = localStorage.getItem('authToken');
//       const userId = localStorage.getItem('currentUserId');
//       if (userId) {
//         store.setCurrentUserId(userId);
//       }
//     }
//   }

//   private delay(ms: number = 500) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   private setToken(token: string, userId: string) {
//     this.token = token;
//     store.setCurrentUserId(userId);
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('authToken', token);
//       localStorage.setItem('currentUserId', userId);
//     }
//   }

//   private getCurrentUser(): (User & { password: string }) | null {
//     const userId = store.getCurrentUserId();
//     if (!userId) return null;
//     return store.getUsers().get(userId) || null;
//   }

//   clearAuth() {
//     this.token = null;
//     store.setCurrentUserId(null);
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('currentUserId');
//     }
//   }

//   // Auth endpoints
//   async register(data: {
//     email: string;
//     password: string;
//     name: string;
//     surname?: string;
//     aboutMe?: string;
//     contacts: Contact[];
//   }) {
//     await this.delay();

//     const existingUser = Array.from(store.getUsers().values()).find(
//       u => u.email === data.email
//     );

//     if (existingUser) {
//       throw new Error('User already exists');
//     }

//     const userId = `user-${Date.now()}`;
//     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

//     const newUser: User & { password: string; verificationCode: string } = {
//       id: userId,
//       email: data.email,
//       name: data.name,
//       surname: data.surname,
//       aboutMe: data.aboutMe,
//       verified: false,
//       status: 'pending',
//       password: data.password,
//       contacts: data.contacts,
//       verificationCode,
//     };

//     store.getUsers().set(userId, newUser);

//     console.log(`Verification code for ${data.email}: ${verificationCode}`);

//     return {
//       message: 'User registered successfully. Please check your email for verification code.',
//       user: {
//         id: newUser.id,
//         email: newUser.email,
//         name: newUser.name,
//         status: newUser.status,
//       },
//     };
//   }

//   async verify(email: string, code: string) {
//     await this.delay();

//     const user = Array.from(store.getUsers().values()).find(u => u.email === email);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     if (user.verified) {
//       throw new Error('Email already verified');
//     }

//     if (user.verificationCode !== code) {
//       throw new Error('Invalid verification code');
//     }

//     user.verified = true;
//     user.status = 'confirmed';
//     delete user.verificationCode;

//     const token = `mock-token-${user.id}-${Date.now()}`;
//     this.setToken(token, user.id);

//     const { password, ...userWithoutPassword } = user;

//     return {
//       message: 'Email verified successfully',
//       token,
//       user: userWithoutPassword,
//     };
//   }

//   async resendCode(email: string) {
//     await this.delay();

//     const user = Array.from(store.getUsers().values()).find(u => u.email === email);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     if (user.verified) {
//       throw new Error('Email already verified');
//     }

//     const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
//     user.verificationCode = verificationCode;

//     console.log(`New verification code for ${email}: ${verificationCode}`);

//     return {
//       message: 'Verification code resent successfully',
//     };
//   }

//   async login(email: string, password: string) {
//     await this.delay();

//     const user = Array.from(store.getUsers().values()).find(u => u.email === email);

//     if (!user || user.password !== password) {
//       throw new Error('Invalid credentials');
//     }

//     if (!user.verified) {
//       const error: any = new Error('Email not verified');
//       error.status = 'pending';
//       throw error;
//     }

//     const token = `mock-token-${user.id}-${Date.now()}`;
//     this.setToken(token, user.id);

//     const { password: _, ...userWithoutPassword } = user;

//     return {
//       token,
//       user: userWithoutPassword,
//     };
//   }

//   async forgotPassword(email: string) {
//     await this.delay();

//     const user = Array.from(store.getUsers().values()).find(u => u.email === email);

//     if (user) {
//       const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
//       user.verificationCode = resetCode;
//       console.log(`Password reset code for ${email}: ${resetCode}`);
//     }

//     return {
//       message: 'If the email exists, a reset code has been sent',
//     };
//   }

//   async resetPassword(email: string, code: string, newPassword: string) {
//     await this.delay();

//     const user = Array.from(store.getUsers().values()).find(u => u.email === email);

//     if (!user) {
//       throw new Error('User not found');
//     }

//     if (user.verificationCode !== code) {
//       throw new Error('Invalid reset code');
//     }

//     user.password = newPassword;
//     delete user.verificationCode;

//     return {
//       message: 'Password reset successfully. You can now login with your new password.',
//     };
//   }

//   // Post endpoints
//   async createPost(data: {
//     title: string;
//     description: string;
//     skills?: string[];
//     region?: string;
//     budget?: { type: 'hourly' | 'fixed' | 'monthly'; value: number };
//   }) {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     const postId = `post-${Date.now()}`;
//     const now = new Date().toISOString();

//     const newPost: WorkPost = {
//       userId: currentUser.id,
//       postId,
//       title: data.title,
//       description: data.description,
//       skills: data.skills,
//       status: ['published'],
//       date: now,
//       publicationDate: now,
//       region: data.region,
//       budget: data.budget,
//     };

//     store.getPosts().set(postId, newPost);

//     return newPost;
//   }

//   async getMyPosts(): Promise<WorkPost[]> {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     return Array.from(store.getPosts().values())
//       .filter(post => post.userId === currentUser.id)
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }

//   async searchPosts(
//     query: string,
//     filters?: SearchFilters,
//     limit = 20,
//     nextToken?: string
//   ): Promise<SearchPostsResponse> {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     let allPosts = Array.from(store.getPosts().values())
//       .filter(post => post.userId !== currentUser.id);

//     let filteredPosts = [...allPosts];

//     if (query && query.trim()) {
//       const searchLower = query.toLowerCase();
//       filteredPosts = filteredPosts.filter(post => {
//         return (
//           post.title.toLowerCase().includes(searchLower) ||
//           post.description.toLowerCase().includes(searchLower) ||
//           post.skills?.some(skill => skill.toLowerCase().includes(searchLower))
//         );
//       });
//     }

//     const apiFilters: AvailableFilters = {
//       regions: ['North America', 'Europe', 'Asia', 'South America'],
//       budgetTypes: ['hourly', 'fixed', 'monthly'],
//       minBudget: 100,
//       maxBudget: 10000,
//     };

//     if (filters) {
//       if (filters.budgetType) {
//         filteredPosts = filteredPosts.filter(post =>
//           post.budget?.type === filters.budgetType
//         );
//       }

//       if (filters.minBudget !== undefined) {
//         filteredPosts = filteredPosts.filter(post =>
//           post.budget && post.budget.value >= filters.minBudget!
//         );
//       }

//       if (filters.maxBudget !== undefined) {
//         filteredPosts = filteredPosts.filter(post =>
//           post.budget && post.budget.value <= filters.maxBudget!
//         );
//       }

//       if (filters.region) {
//         filteredPosts = filteredPosts.filter(post =>
//           post.region?.toLowerCase() === filters.region!.toLowerCase()
//         );
//       }
//     }

//     const sortedPosts = filteredPosts.sort(
//       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
//     );

//     return {
//       posts: sortedPosts.slice(0, limit),
//       nextToken: undefined,
//       filters: apiFilters,
//     };
//   }

//   async listPosts(limit = 20, nextToken?: string): Promise<{
//     posts: WorkPost[];
//     nextToken?: string;
//   }> {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     const allPosts = Array.from(store.getPosts().values())
//       .filter(post => post.userId !== currentUser.id)
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//     return {
//       posts: allPosts.slice(0, limit),
//       nextToken: undefined,
//     };
//   }

//   async getPost(postId: string): Promise<WorkPost> {
//     await this.delay();

//     const post = store.getPosts().get(postId);
//     if (!post) {
//       throw new Error('Post not found');
//     }

//     return post;
//   }

//   async deletePost(postId: string) {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     const post = store.getPosts().get(postId);
//     if (!post) {
//       throw new Error('Post not found');
//     }

//     if (post.userId !== currentUser.id) {
//       throw new Error('You are not authorized to delete this post');
//     }

//     store.getPosts().delete(postId);

//     const proposals = Array.from(store.getProposals().values())
//       .filter(p => p.postId === postId);
    
//     proposals.forEach(p => {
//       store.getProposals().delete(p.proposalId);
//       store.getMessages().delete(p.proposalId);
//       store.getDiscussions().delete(p.proposalId);
//     });

//     return {
//       message: 'Post deleted successfully',
//       deletedPost: {
//         postId: post.postId,
//         title: post.title,
//       },
//     };
//   }

//   async updatePost(postId: string, body: Partial<WorkPost>) {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     const post = store.getPosts().get(postId);
//     if (!post) {
//       throw new Error('Post not found');
//     }

//     if (post.userId !== currentUser.id) {
//       throw new Error('You are not authorized to update this post');
//     }

//     Object.assign(post, body);

//     return {
//       message: 'Post updated successfully',
//       post,
//     };
//   }

//   async editUserProfile(body: Partial<EditUser>) {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     // Update user profile with provided fields
//     if (body.name !== undefined) {
//       currentUser.name = body.name;
//     }
//     if (body.surname !== undefined) {
//       currentUser.surname = body.surname;
//     }
//     if (body.aboutMe !== undefined) {
//       currentUser.aboutMe = body.aboutMe;
//     }
//     if (body.contacts !== undefined) {
//       currentUser.contacts = body.contacts;
//     }

//     const { password, ...userWithoutPassword } = currentUser;

//     return {
//       message: 'Profile updated successfully',
//       user: userWithoutPassword,
//     };
//   }

//   async updatePostStatus(
//     postId: string,
//     status: 'published' | 'disabled' | 'outdated' | 'blocked'
//   ) {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     const post = store.getPosts().get(postId);
//     if (!post) {
//       throw new Error('Post not found');
//     }

//     if (post.userId !== currentUser.id) {
//       throw new Error('You are not authorized to update this post');
//     }

//     post.status = [status];

//     return {
//       message: 'Post status updated successfully',
//       post: {
//         postId: post.postId,
//         status: post.status,
//       },
//     };
//   }

//   // Proposal endpoints
//   async sendProposal(postId: string, coverLetter: string) {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     const post = store.getPosts().get(postId);
//     if (!post) {
//       throw new Error('Post not found');
//     }

//     const existingProposal = Array.from(store.getProposals().values()).find(
//       p => p.postId === postId && p.userId === currentUser.id
//     );

//     if (existingProposal) {
//       throw new Error('You have already sent a proposal for this post');
//     }

//     const proposalId = `proposal-${Date.now()}`;
//     const now = new Date().toISOString();

//     const newProposal: Proposal = {
//       userId: currentUser.id,
//       proposalId,
//       postId,
//       user: {
//         id: currentUser.id,
//         email: currentUser.email,
//         name: `${currentUser.name} ${currentUser.surname || ''}`.trim(),
//         type: 'sender',
//       },
//       date: now,
//       coverLetter,
//       status: 'invited',
//     };

//     store.getProposals().set(proposalId, newProposal);

//     return newProposal;
//   }

//   async getProposalsForPost(postId: string, status?: string): Promise<Proposal[]> {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     const post = store.getPosts().get(postId);
//     if (!post) {
//       throw new Error('Post not found');
//     }

//     if (post.userId !== currentUser.id) {
//       throw new Error('You are not authorized to view proposals for this post');
//     }

//     let proposals = Array.from(store.getProposals().values())
//       .filter(p => p.postId === postId);

//     if (status) {
//       proposals = proposals.filter(p => p.status === status);
//     }

//     return proposals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }

//   async getMyProposals(): Promise<Proposal[]> {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     return Array.from(store.getProposals().values())
//       .filter(p => p.userId === currentUser.id)
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }

//   async getProposalDetails(proposalId: string, postId: string) {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     const proposal = store.getProposals().get(proposalId);
//     if (!proposal) {
//       throw new Error('Proposal not found');
//     }

//     const post = store.getPosts().get(proposal.postId);
//     if (!post) {
//       throw new Error('Post not found');
//     }

//     if (proposal.userId !== currentUser.id && post.userId !== currentUser.id) {
//       throw new Error('Not authorized to view this proposal');
//     }

//     const discussion = store.getDiscussions().get(proposalId);
    
//     // Get the proposal sender's full user info
//     const proposalUser = store.getUsers().get(proposal.userId);
//     if (proposalUser) {
//       // Add user info to the proposal
//       const proposalWithUserInfo = {
//         ...proposal,
//         userInfo: {
//           name: proposalUser.name,
//           surname: proposalUser.surname,
//           aboutMe: proposalUser.aboutMe,
//         }
//       };

//       return {
//         proposal: proposalWithUserInfo,
//         discussion: discussion || null,
//         post: post,
//       };
//     }

//     return {
//       proposal,
//       discussion: discussion || null,
//       post: post,
//     };
//   }

//   async updateProposalStatus(
//     proposalId: string,
//     postId: string,
//     status: 'accepted' | 'discussion' | 'rejected',
//     contacts?: Contact[]
//   ) {
//     await this.delay();

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     const post = store.getPosts().get(postId);
//     if (!post) {
//       throw new Error('Post not found');
//     }

//     if (post.userId !== currentUser.id) {
//       throw new Error('You are not authorized to update this proposal');
//     }

//     const proposal = store.getProposals().get(proposalId);
//     if (!proposal) {
//       throw new Error('Proposal not found');
//     }

//     proposal.status = status;

//     if (status === 'accepted' && !store.getDiscussions().has(proposalId)) {
//       const discussion: ProposalDiscussion = {
//         proposalId,
//         userId: proposal.userId,
//         postId,
//         date: new Date().toISOString(),
//         shownContacts: contacts || currentUser.contacts,
//       };

//       store.getDiscussions().set(proposalId, discussion);
//     }

//     return {
//       message: 'Proposal status updated successfully',
//       proposal: {
//         proposalId: proposal.proposalId,
//         status: proposal.status,
//       },
//     };
//   }

//   // Chat endpoints
//   async sendMessage(proposalId: string, message: string) {
//     await this.delay(300);

//     const currentUser = this.getCurrentUser();
//     if (!currentUser) {
//       throw new Error('Not authenticated');
//     }

//     const proposal = store.getProposals().get(proposalId);
//     if (!proposal) {
//       throw new Error('Proposal not found');
//     }

//     const messageId = `msg-${Date.now()}`;
//     const now = new Date().toISOString();

//     const newMessage: Message = {
//       proposalId,
//       messageId,
//       user: {
//         id: currentUser.id,
//         email: currentUser.email,
//         name: `${currentUser.name} ${currentUser.surname || ''}`.trim(),
//       },
//       date: now,
//       message,
//     };

//     const messages = store.getMessages().get(proposalId) || [];
//     messages.push(newMessage);
//     store.getMessages().set(proposalId, messages);

//     return newMessage;
//   }

//   async getMessages(proposalId: string, limit = 50, nextToken?: string): Promise<{
//     messages: Message[];
//     nextToken?: string;
//   }> {
//     await this.delay(300);

//     const messages = store.getMessages().get(proposalId) || [];

//     return {
//       messages: messages.slice(0, limit),
//       nextToken: undefined,
//     };
//   }

//   async getDiscussion(proposalId: string) {
//     await this.delay();

//     const discussion = store.getDiscussions().get(proposalId);
//     if (!discussion) {
//       throw new Error('Discussion not found');
//     }

//     return discussion;
//   }
// }

// export const apiService = new ApiServiceMock();