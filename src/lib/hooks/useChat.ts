'use client';

import { useState } from 'react';
import { Message, ProposalDiscussion, WorkPost, Proposal } from '@/types';
import { apiService } from '../api/api-client-mock';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [discussion, setDiscussion] = useState<ProposalDiscussion | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [post, setPost] = useState<WorkPost | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | undefined>();

  const loadMessages = async (proposalId: string, loadMore = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiService.getMessages(
        proposalId,
        50,
        loadMore ? nextToken : undefined
      );
      
      if (loadMore) {
        setMessages([...messages, ...result.messages]);
      } else {
        setMessages(result.messages || []);
      }
      
      setNextToken(result.nextToken);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setError('Failed to load messages');
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDiscussion = async (proposalId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const discussionData = await apiService.getDiscussion(proposalId);
      setDiscussion(discussionData);
    } catch (error) {
      console.error('Failed to load discussion:', error);
      setError('Failed to load discussion');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProposalDetails = async (proposalId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await apiService.getProposalDetails(proposalId, '');
      setProposal(details.proposal);
      setPost(details.post || null);
      if (details.discussion) {
        setDiscussion(details.discussion);
      }
    } catch (error) {
      console.error('Failed to load proposal details:', error);
      setError('Failed to load proposal details');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (proposalId: string, content: string) => {
    const message = await apiService.sendMessage(proposalId, content);
    setMessages([...messages, message]);
    return message;
  };

  return {
    messages,
    discussion,
    proposal,
    post,
    isLoading,
    error,
    hasMore: !!nextToken,
    loadMessages,
    loadDiscussion,
    loadProposalDetails,
    sendMessage,
  };
}