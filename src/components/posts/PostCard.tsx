'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, MapPin, LogIn, Clock } from 'lucide-react';
import { WorkPost } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/authStore';
import { useI18n } from '@/lib/i18n/i18n-context';
import { getCurrencySign, getDurationLabel } from '@/config/constants';

interface PostCardProps {
  post: WorkPost;
}

export function PostCard({ post }: PostCardProps) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  const handleViewDetails = () => {
    // Preserve current search params for back navigation
    const currentParams = searchParams.toString();
    const url = `/posts/${post.postId}${currentParams ? `?from=${encodeURIComponent(currentParams)}` : ''}`;
    router.push(url);
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      handleViewDetails();
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 
            className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer"
            onClick={handleViewDetails}
          >
            {post.title}
          </h3>
          
          <p className="text-gray-600 mt-2 line-clamp-3">{post.description}</p>
        </div>
        {(post.budget && post.budget.value !== 0) && (
          <div className="text-right ml-4">
            <p className="text-lg font-bold text-green-600">
              {post.budget.value} {getCurrencySign(post.budget.currency)}
            </p>
            <p className="text-sm text-gray-500 capitalize">{t(`posts.${post.budget.type.toLowerCase()}`)}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <Badge>
          {post.category}
        </Badge>
        {post.skills && (post.skills.slice(0, 5).map((skill, index) => (
          <Badge key={index} variant="default">
            {skill}
          </Badge>
        )))}
        {(post.skills && post.skills.length > 5) && (
          <Badge variant="default">+{post.skills.length - 5} {t('myPosts.more')}</Badge>
        )}
      </div>

      <div className="flex items-center text-sm text-gray-600 ml-2 mb-2">
        <Clock className="w-4 h-4 mr-1" />
        <span>{getDurationLabel(post.duration, t)}</span>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          {t('myPosts.posted')} {new Date(post.date).toLocaleDateString()}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleViewDetails}
          >
            <Eye className="w-4 h-4" /> {t('postCard.viewDetails')}
          </Button>
        </div>
      </div>
    </Card>
  );
}