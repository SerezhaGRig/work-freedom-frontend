'use client';

import { useRouter } from 'next/navigation';
import { Plus, Search, Briefcase, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function QuickActions() {
  const router = useRouter();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
<div className="space-y-3">
<Button onClick={() => router.push('/my-posts')} className="w-full">
<Plus className="w-5 h-5" /> Create New Post
</Button>
<Button
onClick={() => router.push('/posts')}
variant="secondary"
className="w-full"
>
<Search className="w-5 h-5" /> Browse Jobs
</Button>
<Button
onClick={() => router.push('/my-posts')}
variant="secondary"
className="w-full"
>
<Briefcase className="w-5 h-5" /> My Posts
</Button>
<Button
onClick={() => router.push('/proposals')}
variant="secondary"
className="w-full"
>
<FileText className="w-5 h-5" /> My Proposals
</Button>
</div>
</Card>
);
}