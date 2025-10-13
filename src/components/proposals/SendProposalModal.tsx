'use client';

import { useState } from 'react';
import { WorkPost } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { useProposals } from '@/lib/hooks/useProposals';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';

interface SendProposalModalProps {
  isOpen: boolean;
  post: WorkPost | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SendProposalModal({
  isOpen,
  post,
  onClose,
  onSuccess,
}: SendProposalModalProps) {
  const { sendProposal } = useProposals();
  const [coverLetter, setCoverLetter] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!post) return;
    
    setIsLoading(true);
    try {
      await sendProposal(post.postId, coverLetter);
      setCoverLetter('');
      onSuccess();
      alert('Proposal sent successfully!');
    } catch (error) {
      alert('Failed to send proposal');
    } finally {
      setIsLoading(false);
    }
  };

  if (!post) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Proposal">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800">{post.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{post.description}</p>
        </div>
        
        <TextArea
          label="Cover Letter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Tell the employer why you're the perfect fit for this job..."
          required
          rows={8}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Proposal'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}