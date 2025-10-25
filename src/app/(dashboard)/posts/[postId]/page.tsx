'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, Calendar, Briefcase, User, Send, MapPin } from 'lucide-react';
import { WorkPost } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { useProposals } from '@/lib/hooks/useProposals';
import { apiService } from '@/lib/api/api-client';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;
  
  const [post, setPost] = useState<WorkPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { sendProposal } = useProposals();

  useEffect(() => {
    if (postId) {
      loadPost();
    }
  }, [postId]);

  const loadPost = async () => {
    setIsLoading(true);
    try {
      const postData = await apiService.getPost(postId);
      setPost(postData);
    } catch (error) {
      console.error('Failed to load post:', error);
      alert('Failed to load job details');
      router.push('/posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendProposal = async () => {
    if (!coverLetter.trim()) {
      alert('Please write a cover letter');
      return;
    }

    setIsSending(true);
    try {
      await sendProposal(postId, coverLetter);
      alert('Proposal sent successfully!');
      router.push('/proposals');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send proposal';
      alert(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-gray-500">Job not found</p>
          <Button onClick={() => router.push('/posts')} className="mt-4">
            Back to Jobs
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => router.push('/posts')}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h1>
                
                <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Posted {new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                
                {/* Region Display */}
                {post.region && (
                  <div className="flex items-center text-sm text-gray-700 bg-blue-50 px-3 py-1.5 rounded-full w-fit">
                    <MapPin className="w-4 h-4 mr-1.5 text-blue-600" />
                    <span className="font-medium">{post.region}</span>
                  </div>
                )}
              </div>
              
              {post.budget && (
                <div className="text-right">
                  <div className="flex items-center text-2xl font-bold text-green-600">
                    <DollarSign className="w-6 h-6" />
                    {post.budget.value}
                  </div>
                  <p className="text-sm text-gray-500 capitalize">{post.budget.type}</p>
                </div>
              )}
            </div>

            {/* Skills */}
            {post.skills && (<div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {post.skills.map((skill, index) => (
                  <Badge key={index} variant="default">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>)}

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Job Description</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {post.description}
                </p>
              </div>
            </div>
          </Card>

          {/* Send Proposal Section */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Submit Your Proposal
            </h2>
            
            <div className="space-y-4">
              <TextArea
                label="Cover Letter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Introduce yourself and explain why you're the perfect fit for this job. Highlight your relevant experience and skills..."
                rows={12}
                required
              />
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="text-blue-600 text-xl">💡</div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Tips for a Great Proposal
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Be specific about your relevant experience</li>
                      <li>• Mention similar projects you've completed</li>
                      <li>• Explain your approach to this project</li>
                      <li>• Keep it professional and concise</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => router.push('/posts')}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendProposal}
                  disabled={isSending || !coverLetter.trim()}
                >
                  {isSending ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Proposal
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details Card */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Job Details</h3>
            
            <div className="space-y-4">
              {post.region && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Region</p>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="font-medium text-gray-800">
                      {post.region}
                    </span>
                  </div>
                </div>
              )}
              
              <div>
                <p className="text-xs text-gray-500 mb-1">Budget Type</p>
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-800 capitalize">
                    {post.budget?.type || 'Not specified'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Posted On</p>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-800">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <div className="flex items-center text-sm">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-600" />
                  <Badge variant="success">Open</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Job ID</p>
                <p className="text-xs text-gray-600 font-mono break-all">
                  {post.postId}
                </p>
              </div>
            </div>
          </Card>

          {/* About the Client */}
          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              About the Client
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                Review the job details carefully and submit a personalized proposal that 
                highlights your relevant skills and experience.
              </p>
              <p className="text-xs text-gray-500">
                After submitting, the client will review your proposal and may contact you 
                for further discussion.
              </p>
            </div>
          </Card>

          {/* Warning Card */}
          <Card className="p-6 bg-amber-50 border-amber-200">
            <div className="flex items-start space-x-3">
              <div className="text-amber-600 text-xl">⚠️</div>
              <div>
                <h4 className="font-semibold text-amber-900 mb-1 text-sm">
                  Before You Apply
                </h4>
                <p className="text-xs text-amber-800">
                  Make sure you have the required skills and can commit to the project 
                  timeline. Only send genuine proposals.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}