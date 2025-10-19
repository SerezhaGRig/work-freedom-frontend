export interface User {
  id: string;
  email: string;
  name: string;
  surname?: string;
  contacts: Contact[];
  verified: boolean;
  status?: 'pending' | 'confirmed' | 'recover';
}

export interface Contact {
  type: 'phone' | 'whatsapp' | 'viber' | 'web' | 'email';
  value: string;
  show: boolean;
}

export interface WorkPost {
  userId: string;
  postId: string;
  title: string;
  description: string;
  skills: string[];
  status: string[];
  date: string;
  publicationDate: string;
  region?: string; // Added region field
  budget?: {
    type: 'hourly' | 'fixed';
    value: number;
  };
}

export interface Proposal {
  userId: string;
  proposalId: string;
  postId: string;
  user: {
    id: string;
    email: string;
    name: string;
    type: 'sender' | 'postOwner';
  };
  date: string;
  coverLetter: string;
  status: 'invited' | 'accepted' | 'discussion' | 'rejected';
}

export interface ProposalDiscussion {
  proposalId: string;
  userId: string;
  postId: string;
  date: string;
  shownContacts: Contact[];
}

export interface Message {
  proposalId: string;
  messageId: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  date: string;
  message: string;
}

export interface ProposalDetailsResponse {
  proposal: Proposal;
  discussion?: ProposalDiscussion;
  post?: WorkPost;
}

export interface SearchFilters {
  budgetType?: 'hourly' | 'fixed';
  minBudget?: number;
  maxBudget?: number;
  region?: string;
}

// API Response includes available filters
export interface SearchPostsResponse {
  posts: WorkPost[];
  nextToken?: string;
  availableFilters?: {
    regions?: string[];
    budgetTypes?: ('hourly' | 'fixed')[];
    minBudget?: number;
    maxBudget?: number;
  };
}