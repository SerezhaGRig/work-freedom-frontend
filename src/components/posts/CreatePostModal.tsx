'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { usePosts } from '@/lib/hooks/usePosts';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePostModal({ isOpen, onClose, onSuccess }: CreatePostModalProps) {
  const { createPost } = usePosts();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [budgetType, setBudgetType] = useState<'hourly' | 'fixed'>('hourly');
  const [budgetValue, setBudgetValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
      await createPost({
        title,
        description,
        skills: skillsArray,
        budget: budgetValue ? {
          type: budgetType,
          value: parseFloat(budgetValue)
        } : undefined,
      });
      
      setTitle('');
      setDescription('');
      setSkills('');
      setBudgetValue('');
      onSuccess();
    } catch (error) {
      alert('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Job Post">
      <div className="space-y-4">
        <Input
          label="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Senior Full Stack Developer"
          required
        />
        
        <TextArea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the job requirements and responsibilities..."
          required
          rows={6}
        />
        
        <Input
          label="Required Skills (comma-separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="e.g. React, Node.js, TypeScript"
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Type
            </label>
            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value as 'hourly' | 'fixed')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="hourly">Hourly Rate</option>
              <option value="fixed">Fixed Price</option>
            </select>
          </div>
          
          <Input
            label="Budget Value ($)"
            type="number"
            value={budgetValue}
            onChange={(e) => setBudgetValue(e.target.value)}
            placeholder="e.g. 50"
          />
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}