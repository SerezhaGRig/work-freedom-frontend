'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Briefcase, User, Send, MapPin, LogIn, Clock } from 'lucide-react';
import { WorkPost } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { useProposals } from '@/lib/hooks/useProposals';
import { apiService } from '@/lib/api/api-client';
import { Share } from '@/components/ui/Share';
import { useAuthStore } from '@/lib/store/authStore';
import { useI18n } from '@/lib/i18n/i18n-context';
import { getCurrencySign, getDurationLabel } from '@/config/constants';
import { PostCard } from '@/components/posts/PostCard';

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.postId as string;
  const { isAuthenticated } = useAuthStore();
  const { t, locale } = useI18n();

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
      alert(t('errors.loadingFailed'));
      router.push(isAuthenticated ? '/posts' : '/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendProposal = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!coverLetter.trim()) {
      alert(t('errors.coverLetterRequired'));
      return;
    }

    setIsSending(true);
    try {
      await sendProposal(postId, coverLetter);
      alert(t('jobDetails.proposalSentSuccess'));
      router.push('/proposals');
    } catch (error: any) {
      const errorMessage = error.message || t('errors.sendProposalFailed');
      alert(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleBackClick = () => {
    router.push('/posts');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">{t('jobDetails.loading')}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-gray-500">{t('jobDetails.jobNotFound')}</p>
          <Button onClick={handleBackClick} className="mt-4">
            {t('jobDetails.backToBrowse')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Button
        variant="secondary"
        size="sm"
        onClick={handleBackClick}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> {t('jobDetails.backToBrowse')}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h1>

                <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{t('jobDetails.posted')} {new Date(post.date).toLocaleDateString(locale)}</span>
                  </div>
                  <Badge variant="success">{t('jobDetails.active')}</Badge>
                </div>

                {post.region && (
                  <div className="flex items-center text-sm text-gray-700 bg-blue-50 px-3 py-1.5 rounded-full w-fit">
                    <MapPin className="w-4 h-4 mr-1.5 text-blue-600" />
                    <span className="font-medium">{post.region}</span>
                  </div>
                )}
              </div>

              {(post.budget && post.budget.value !== 0  ) && (
                <div className="text-right">
                  <div className="flex items-center text-2xl font-bold text-green-600">   
                    {post.budget.value}
                    <span className="inline-block w-3 h-4 text-center leading-4 text-current ml-2">
                      {getCurrencySign(post.budget.currency)}
                    </span>    
                  </div>
                  <p className="text-sm text-gray-500 capitalize mt-1">{t(`posts.${post.budget.type}`)}</p>
                </div>
              )}
            </div>

            {post.skills && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('jobDetails.requiredSkills')}</h3>
                <div className="flex flex-wrap gap-2">
                  {post.skills.map((skill, index) => (
                    <Badge key={index} variant="default">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('jobDetails.jobDescription')}</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {post.description}
                </p>
              </div>
            </div>
          </Card>

          {isAuthenticated ? (
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('jobDetails.submitProposal')}
              </h2>

              <div className="space-y-4">
                <TextArea
                  label={t('jobDetails.coverLetter')}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder={t('jobDetails.coverLetterPlaceholder')}
                  rows={12}
                  required
                />

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-blue-600 text-xl">💡</div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">
                        {t('jobDetails.proposalTips.title')}
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• {t('jobDetails.proposalTips.tip1')}</li>
                        <li>• {t('jobDetails.proposalTips.tip2')}</li>
                        <li>• {t('jobDetails.proposalTips.tip3')}</li>
                        <li>• {t('jobDetails.proposalTips.tip4')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/posts')}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    onClick={handleSendProposal}
                    disabled={isSending || !coverLetter.trim()}
                  >
                    {isSending ? (
                      <>{t('jobDetails.sending')}</>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> {t('jobDetails.sendProposal')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('jobDetails.interestedInJob')}
                </h2>
                <p className="text-gray-600 mb-6">
                  {t('jobDetails.createAccountToApply')}
                </p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/login')}
                  >
                    {t('common.login')}
                  </Button>
                  <Button onClick={() => router.push('/register')}>
                    {t('common.signUp')}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-800 mb-4">{t('jobDetails.jobDetailsSection')}</h3>

            <div className="space-y-4">
              {post.region && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('jobDetails.region')}</p>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="font-medium text-gray-800">
                      {post.region}
                    </span>
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('jobDetails.projectDuration')}</p>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-800">
                    {getDurationLabel(post.duration, t)}
                  </span>
                </div>
              </div>

                           <div>
                <p className="text-xs text-gray-500 mb-1">{t('jobDetails.category')}</p>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-800">
                    {post.category}
                  </span>
                </div>
              </div>


              <div>
                <p className="text-xs text-gray-500 mb-1">{t('jobDetails.postedOn')}</p>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-800">
                    {new Date(post.date).toLocaleDateString(locale, {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">{t('jobDetails.status')}</p>
                <div className="flex items-center text-sm">
                  <Briefcase className="w-4 h-4 mr-2 text-gray-600" />
                  <Badge variant="success">{t('jobDetails.open')}</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">{t('jobDetails.jobId')}</p>
                <p className="text-xs text-gray-600 font-mono break-all">
                  {post.postId}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              {t('jobDetails.aboutClient')}
            </h3>

            <div className="space-y-3 text-sm text-gray-600">
              <p>{t('jobDetails.reviewCarefully')}</p>
              <p className="text-xs text-gray-500">
                {t('jobDetails.afterSubmitting')}
              </p>
            </div>
          </Card>

          {isAuthenticated && (
            <Card className="p-6 bg-amber-50 border-amber-200">
              <div className="flex items-start space-x-3">
                <div className="text-amber-600 text-xl">⚠️</div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1 text-sm">
                    {t('jobDetails.beforeYouApply')}
                  </h4>
                  <p className="text-xs text-amber-800">
                    {t('jobDetails.ensureSkills')}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {post && typeof window !== 'undefined' && (
            <Share 
              title={post.title} 
              description={post.description} 
              shareUrl={window.location.href}
            />
          )}
        </div>
      </div>
    </div>
  );
}