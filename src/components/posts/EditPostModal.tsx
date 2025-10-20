'use client';

import { useState, useEffect } from 'react';
import { WorkPost } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { apiService } from '@/lib/api/api-client-mock';

interface EditPostModalProps {
  isOpen: boolean;
  post: WorkPost;
  onClose: () => void;
  onSuccess: () => void;
}

// Common regions list
const REGIONS = [
  'Remote',
  'North America',
  'Europe',
  'Asia',
  'South America',
  'Africa',
  'Oceania',
  'Middle East',
  'Worldwide',
];

export function EditPostModal({
  isOpen,
  post,
  onClose,
  onSuccess,
}: EditPostModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [region, setRegion] = useState('');
  const [budgetType, setBudgetType] = useState<'hourly' | 'fixed' | 'monthly'>('hourly');
  const [budgetValue, setBudgetValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setSkills(post.skills?.join(', ') || '');
      setRegion(post.region || '');
      setBudgetType(post.budget?.type || 'hourly');
      setBudgetValue(post.budget?.value.toString() || '');
    }
  }, [post]);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !skills.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(s => s): undefined;
      await apiService.updatePost(post.postId, {
        title,
        description,
        skills: skillsArray,
        region: region || undefined,
        budget: budgetValue ? {
          type: budgetType,
          value: parseFloat(budgetValue)
        } : undefined,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Post updated successfully!');
      onSuccess();
    } catch (error) {
      alert('Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Job Post">
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
        />
        
        {/* Region Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Region
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a region (optional)</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Specify the work location or choose "Remote" for remote positions
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Type
            </label>
            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value as 'hourly' | 'fixed' | 'monthly')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="hourly">Hourly Rate</option>
              <option value="fixed">Fixed Price</option>
              <option value="monthly">Monthly Price</option>
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
            {isLoading ? 'Updating...' : 'Update Post'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}