'use client';

import { useState } from 'react';
import { Proposal } from '@/types';
import { apiService } from '../api/api-client-mock';
import { useAuthStore } from '../store/authStore';

export function useProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [myProposals, setMyProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const loadProposalsForPost = async (postId: string, status?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const postProposals = await apiService.getProposalsForPost(postId, status);
      setProposals(postProposals || []);
    } catch (error) {
      console.error('Failed to load proposals:', error);
      setError('Failed to load proposals');
      setProposals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyProposals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userProposals = await apiService.getMyProposals();
      setMyProposals(userProposals || []);
    } catch (error) {
      console.error('Failed to load my proposals:', error);
      setError('Failed to load my proposals');
      setMyProposals([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendProposal = async (postId: string, coverLetter: string) => {
    await apiService.sendProposal(postId, coverLetter);
  };

  const updateProposalStatus = async (
    proposal: Proposal,
    status: 'accepted' | 'discussion' | 'rejected'
  ) => {
    await apiService.updateProposalStatus(
      proposal.proposalId,
      proposal.postId,
      status,
      user?.contacts
    );
    await loadProposalsForPost(proposal.postId);
  };

  const getProposalDetails = async (proposalId: string, postId: string) => {
    return await apiService.getProposalDetails(proposalId, postId);
  };

  return {
    proposals,
    myProposals,
    isLoading,
    error,
    loadProposalsForPost,
    loadMyProposals,
    sendProposal,
    updateProposalStatus,
    getProposalDetails,
  };
}