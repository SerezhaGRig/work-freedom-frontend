export interface User {
  id: string;
  email: string;
  name: string;
  surname?: string;
  contacts: Contact[];
    aboutMe?: string; // Add this line
  verified: boolean;
  status?: 'pending' | 'confirmed' | 'recover';
}

export interface EditUser {
  name: string;
  surname?: string;
    aboutMe?: string; // Add this line

  contacts: Contact[];
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
  skills?: string[];
  status: string[];
  duration: 'less_than_month' | 'less_than_3_months' | 'more_than_3_months';
  category: 'IT' | 'Other';
  date: string;
  publicationDate: string;
  region?: string; // Added region field
  budget?: {
    type: 'hourly' | 'fixed' | 'monthly';
    value: number;
    currency: 'rubl' | 'dollar' | 'dram'
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
  status: 'pending' | 'accepted' | 'discussion' | 'rejected' |'invited';
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
  budgetType?: 'hourly' | 'fixed' | 'monthly';
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
    budgetTypes?: ('hourly' | 'fixed' | 'monthly')[];
    minBudget?: number;
    maxBudget?: number;
  };
}