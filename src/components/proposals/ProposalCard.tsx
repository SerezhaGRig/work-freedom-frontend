'use client';

import { useRouter } from 'next/navigation';
import { Check, X, MessageCircle } from 'lucide-react';
import { Proposal } from '@/types';
import { useProposals } from '@/lib/hooks/useProposals';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const router = useRouter();
  const { updateProposalStatus } = useProposals();

  const handleStatusUpdate = async (status: string) => {
    try {
      await updateProposalStatus(proposal, status as any);
      alert(`Proposal ${status} successfully!`);
    } catch (error) {
      alert('Failed to update proposal status');
    }
  };

  const handleChat = () => {
    router.push(`/chat?proposalId=${proposal.proposalId}`);
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'discussion':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <div className="border-l-4 border-blue-500 pl-4 py-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{proposal.user.name}</p>
          <p className="text-gray-600 mt-1">{proposal.coverLetter}</p>
          <p className="text-sm text-gray-500 mt-2">
            Sent {new Date(proposal.date).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Badge variant={getBadgeVariant(proposal.status)}>
            {proposal.status}
          </Badge>
          
          {proposal.status === 'invited' && (
            <>
              <Button
                size="sm"
                variant="success"
                onClick={() => handleStatusUpdate('accepted')}
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleStatusUpdate('rejected')}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          
          {(proposal.status === 'accepted' || proposal.status === 'discussion') && (
            <Button size="sm" onClick={handleChat}>
              <MessageCircle className="w-4 h-4" /> Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}