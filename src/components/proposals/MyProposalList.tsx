'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Calendar, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { Proposal } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface MyProposalsListProps {
  proposals: Proposal[];
  onUpdate: () => void;
}

export function MyProposalsList({ proposals, onUpdate }: MyProposalsListProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'invited':
        return 'Waiting for response';
      case 'accepted':
        return 'Accepted - Ready to chat';
      case 'discussion':
        return 'In discussion';
      case 'rejected':
        return 'Not selected';
      default:
        return status;
    }
  };

  const handleOpenChat = (proposalId: string) => {
    router.push(`/chat?proposalId=${proposalId}`);
  };

  const toggleExpand = (proposalId: string) => {
    setExpandedId(expandedId === proposalId ? null : proposalId);
  };

  // Group proposals by status
  const groupedProposals = {
    active: proposals.filter(p => p.status === 'accepted' || p.status === 'discussion'),
    pending: proposals.filter(p => p.status === 'invited'),
    rejected: proposals.filter(p => p.status === 'rejected'),
  };

  const renderProposalCard = (proposal: Proposal) => {
    const isExpanded = expandedId === proposal.proposalId;
    const isAccepted = proposal.status === 'accepted' || proposal.status === 'discussion';

    return (
      <Card key={proposal.proposalId} className="p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <h3 className="font-semibold text-gray-800">Job Post</h3>
            </div>
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant={getBadgeVariant(proposal.status)}>
                {proposal.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {getStatusDescription(proposal.status)}
              </span>
            </div>
          </div>

          {isAccepted && (
            <Button
              size="sm"
              onClick={() => handleOpenChat(proposal.proposalId)}
            >
              <MessageCircle className="w-4 h-4" /> Open Chat
            </Button>
          )}
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Sent {new Date(proposal.date).toLocaleDateString()}</span>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Cover Letter</p>
            <button
              onClick={() => toggleExpand(proposal.proposalId)}
              className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
            >
              {isExpanded ? (
                <>
                  Hide <ChevronUp className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Show <ChevronDown className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
          
          {isExpanded && (
            <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
              {proposal.coverLetter}
            </p>
          )}
          
          {!isExpanded && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {proposal.coverLetter}
            </p>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {groupedProposals.active.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Active Conversations ({groupedProposals.active.length})
          </h2>
          <div className="space-y-3">
            {groupedProposals.active.map(renderProposalCard)}
          </div>
        </div>
      )}

      {groupedProposals.pending.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            Pending Response ({groupedProposals.pending.length})
          </h2>
          <div className="space-y-3">
            {groupedProposals.pending.map(renderProposalCard)}
          </div>
        </div>
      )}

      {groupedProposals.rejected.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Not Selected ({groupedProposals.rejected.length})
          </h2>
          <div className="space-y-3">
            {groupedProposals.rejected.map(renderProposalCard)}
          </div>
        </div>
      )}
    </div>
  );
}