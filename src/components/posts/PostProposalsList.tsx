'use client';

import { useState } from 'react';
import { Check, X, MessageCircle, Mail, User, FileText, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Proposal } from '@/types';
import { useProposals } from '@/lib/hooks/useProposals';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface ProposalWithUserInfo extends Proposal {
  userInfo?: {
    aboutMe?: string;
    name: string;
    surname?: string;
  };
}

interface PostProposalsListProps {
  proposals: Proposal[];
  postId: string;
  isLoading: boolean;
  onUpdate: () => void;
}

export function PostProposalsList({
  proposals,
  postId,
  isLoading,
  onUpdate,
}: PostProposalsListProps) {
  const router = useRouter();
  const { updateProposalStatus, getProposalWithUserInfo } = useProposals();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<ProposalWithUserInfo | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleStatusUpdate = async (
    proposal: Proposal,
    status: 'accepted' | 'discussion' | 'rejected'
  ) => {
    setProcessingId(proposal.proposalId);
    try {
      await updateProposalStatus(proposal, status);
      alert(`Proposal ${status} successfully!`);
      onUpdate();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update proposal status';
      alert(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenChat = (proposalId: string) => {
    router.push(`/chat?proposalId=${proposalId}`);
  };

  const handleViewProfile = async (proposal: Proposal) => {
    try {
      // Get full user info including aboutMe
      const fullProposalInfo = await getProposalWithUserInfo(proposal.proposalId, proposal.postId);
      setSelectedProposal(fullProposalInfo);
      setShowProfileModal(true);
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Fallback to basic proposal info
      setSelectedProposal(proposal as ProposalWithUserInfo);
      setShowProfileModal(true);
    }
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'discussion':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 text-sm mt-2">Loading proposals...</p>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No proposals yet</p>
        <p className="text-gray-400 text-xs mt-1">
          Proposals will appear here when freelancers apply
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800 mb-3">
          Proposals ({proposals.length})
        </h4>
        
        {proposals.map((proposal) => {
          const isAccepted = proposal.status === 'accepted' || proposal.status === 'discussion';
          
          return (
            <div
              key={proposal.proposalId}
              className="bg-gray-50 rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-800">{proposal.user.name}</p>
                      <button
                        onClick={() => handleViewProfile(proposal)}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        View Profile
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Mail className="w-3 h-3" />
                      <span>{proposal.user.email}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={getBadgeVariant(proposal.status)}>
                  {proposal.status}
                </Badge>
              </div>

              <div className="bg-white rounded p-3">
                <p className="text-sm text-gray-700">{proposal.coverLetter}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Sent {new Date(proposal.date).toLocaleDateString()}</span>
                
                <div className="flex items-center space-x-2">
                  {proposal.status === 'invited' && (
                    <>
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleStatusUpdate(proposal, 'accepted')}
                        disabled={processingId === proposal.proposalId}
                      >
                        <Check className="w-3 h-3" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleStatusUpdate(proposal, 'rejected')}
                        disabled={processingId === proposal.proposalId}
                      >
                        <X className="w-3 h-3" /> Reject
                      </Button>
                    </>
                  )}
                  
                  {isAccepted && (
                    <Button
                      size="sm"
                      onClick={() => handleOpenChat(proposal.proposalId)}
                    >
                      <MessageCircle className="w-3 h-3" /> Open Chat
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Modal */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Freelancer Profile"
      >
        {selectedProposal && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedProposal.user.name}
                </h3>
                <p className="text-sm text-gray-500">{selectedProposal.user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">About</h4>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedProposal.userInfo?.aboutMe ? (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedProposal.userInfo.aboutMe}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No bio provided by this freelancer
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase className="w-4 h-4 text-gray-600" />
                  <h4 className="font-semibold text-gray-800">Cover Letter</h4>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedProposal.coverLetter}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">
                  Proposal submitted: {new Date(selectedProposal.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}