'use client';

import { useState, useEffect } from 'react';
import { Edit3, Trash2, Users, DollarSign, Calendar, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { WorkPost } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EditPostModal } from './EditPostModal';
import { DeletePostModal } from './DeletePostModal';
import { PostProposalsList } from './PostProposalsList';
import { useProposals } from '@/lib/hooks/useProposals';
import { Share } from '../ui/Share';
import { useI18n } from '@/lib/i18n/i18n-context';
import path from 'path';

interface MyPostCardProps {
  post: WorkPost;
  onUpdate: () => void;
}

export function MyPostCard({ post, onUpdate }: MyPostCardProps) {
  const { t } = useI18n();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProposals, setShowProposals] = useState(false);
  const { proposals, loadProposalsForPost, isLoading } = useProposals();
  const [proposalCount, setProposalCount] = useState(0);

  useEffect(() => {
    // Load proposal count on mount
    loadProposals();
  }, [post.postId]);

  useEffect(() => {
    setProposalCount(proposals.length);
  }, [proposals]);

  const loadProposals = async () => {
    try {
      await loadProposalsForPost(post.postId);
    } catch (error) {
      console.error('Failed to load proposals:', error);
    }
  };

  const handleToggleProposals = async () => {
    if (!showProposals) {
      await loadProposals();
    }
    setShowProposals(!showProposals);
  };

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {post.title}
            </h3>
            
            {/* Region Display */}
            {post.region && (
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="w-3.5 h-3.5 mr-1" />
                <span>{post.region}</span>
              </div>
            )}
            
            <p className="text-sm text-gray-600 line-clamp-3">
              {post.description}
            </p>
          </div>
          <Badge variant="success">{t('posts.published')}</Badge>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.skills && (post.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="default">
              {skill}
            </Badge>
          )))}
          {(post.skills && post.skills.length>3) && (
            <Badge variant="default">+{post.skills.length - 3} {t('myPosts.more')}</Badge>
          )}
        </div>

        <div className="space-y-2 mb-4 text-sm">
          {post.budget && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="font-semibold text-green-600">
                ${post.budget.value}
              </span>
              <span className="ml-1 text-gray-500">/ {post.budget.type}</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{t('myPosts.posted')} {new Date(post.date).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span className="font-semibold text-blue-600">{proposalCount}</span>
            <span className="ml-1">
              {proposalCount === 1 ? t('myPosts.proposal') : t('myPosts.proposals')}
            </span>
          </div>

        </div>

      {/* Buttons section */}
      <div className="pt-4 border-t border-gray-200">
        {/* Action buttons row */}
        <div className="flex items-center gap-2 mb-3">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowEditModal(true)}
          >
            <Edit3 className="w-4 h-4 mr-1" />
            {t('common.edit')}
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {t('common.delete')}
          </Button>

          <Share
            title={post.title}
            description={post.description}
            disableCopy={true}
            shareUrl={path.join(window.location.origin, 'posts', post.postId)}
          />
        </div>

        {/* View Proposals button - always below */}
        <Button
          size="sm"
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={handleToggleProposals}
          disabled={isLoading && !showProposals}
        >
          {isLoading && !showProposals ? (
            <>{t('common.loading')}</>
          ) : showProposals ? (
            <>
              <ChevronUp className="w-4 h-4 mr-1" /> {t('myPosts.hideProposals')}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-1" /> {t('myPosts.viewProposals')} ({proposalCount})
            </>
          )}
        </Button>
      </div>

        {showProposals && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <PostProposalsList
              proposals={proposals}
              postId={post.postId}
              isLoading={isLoading}
              onUpdate={loadProposals}
            />
          </div>
        )}
      </Card>

      <EditPostModal
        isOpen={showEditModal}
        post={post}
        onClose={() => setShowEditModal(false)}
        onSuccess={() => {
          setShowEditModal(false);
          onUpdate();
        }}
      />

      <DeletePostModal
        isOpen={showDeleteModal}
        post={post}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={() => {
          setShowDeleteModal(false);
          onUpdate();
        }}
      />      
    </>
  );
}