
'use client';

import { useRouter } from 'next/navigation';
import { Eye, MapPin } from 'lucide-react';
import { WorkPost } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface PostCardProps {
  post: WorkPost;
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter();

  const handleViewDetails = () => {
    router.push(`/posts/${post.postId}`);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          
          {/* Region Badge */}
          {post.region && (
            <div className="flex items-center text-sm text-gray-600 mt-1 mb-2">
              <MapPin className="w-3.5 h-3.5 mr-1" />
              <span>{post.region}</span>
            </div>
          )}
          
          <p className="text-gray-600 mt-2 line-clamp-3">{post.description}</p>
        </div>
        {post.budget && (
          <div className="text-right ml-4">
            <p className="text-lg font-bold text-green-600">
              ${post.budget.value}
            </p>
            <p className="text-sm text-gray-500 capitalize">{post.budget.type}</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {post.skills.slice(0, 5).map((skill, index) => (
          <Badge key={index} variant="default">
            {skill}
          </Badge>
        ))}
        {post.skills.length > 5 && (
          <Badge variant="default">+{post.skills.length - 5} more</Badge>
        )}
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Posted {new Date(post.date).toLocaleDateString()}
        </p>
        <Button
          size="sm"
          onClick={() => {
            handleViewDetails();
          }}
        >
          <Eye className="w-4 h-4" /> View Details
        </Button>
      </div>
    </Card>
  );
}