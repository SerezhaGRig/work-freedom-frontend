'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, User, Calendar, DollarSign, FileText } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { ContactsDisplay } from '@/components/chat/ContactsDisplay';
import { useChat } from '@/lib/hooks/useChat';
import { useAuthStore } from '@/lib/store/authStore';
import { useI18n } from '@/lib/i18n/i18n-context';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const proposalId = searchParams.get('proposalId');
  const { user } = useAuthStore();
  const { t, locale } = useI18n();
  
  const {
    messages,
    discussion,
    proposal,
    post,
    loadMessages,
    loadProposalDetails,
    sendMessage,
    stopPolling,
    isLoading
  } = useChat();
  
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (proposalId) {
      loadChatData();
    }

    return () => {
      stopPolling();
    };
  }, [proposalId]);

  const loadChatData = async () => {
    if (!proposalId) return;
    
    try {
      await loadProposalDetails(proposalId);
      await loadMessages(proposalId);
    } catch (error) {
      console.error('Failed to load chat data:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!proposalId || !newMessage.trim()) return;
    
    try {
      await sendMessage(proposalId, newMessage);
      setNewMessage('');
    } catch (error) {
      alert(t('chat.sendMessageFailed'));
    }
  };

  const handleBack = () => {
    stopPolling();
    if (proposal?.userId === user?.id) {
      router.push('/proposals');
    } else {
      router.push('/my-posts');
    }
  };

  if (!proposalId) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-gray-500">{t('chat.noChat')}</p>
          <Button onClick={() => router.push('/dashboard')} className="mt-4">
            {t('chat.goToDashboard')}
          </Button>
        </Card>
      </div>
    );
  }

  if (isLoading && !proposal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-4">{t('chat.loadingConversation')}</p>
        </div>
      </div>
    );
  }

  const isSender = proposal?.userId === user?.id;
  const otherUserName = isSender ? t('chat.jobOwner') : proposal?.user.name;
  const proposalWithUserInfo = proposal as any;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-12rem)] flex flex-col">
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {otherUserName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isSender ? t('chat.discussingProposal') : t('chat.proposalConversation')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <Badge variant="success">{t('chat.live')}</Badge>
              </div>
            </div>
            
            <ChatContainer
              messages={messages}
              newMessage={newMessage}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
            />
          </Card>
        </div>

        <div className="space-y-6">
          {post && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                {t('chat.jobPost')}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {post.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.skills && (post.skills.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="default">
                      {skill}
                    </Badge>
                  )))}
                  {(post.skills && post.skills.length > 4) && (
                    <Badge variant="default">+{post.skills.length - 4}</Badge>
                  )}
                </div>

                {post.budget && (
                  <div className="flex items-center text-sm text-gray-600 pt-2 border-t border-gray-200">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="font-semibold text-green-600">
                      ${post.budget.value}
                    </span>
                    <span className="mx-1">/</span>
                    <span>{t(`posts.${post.budget.type}`)}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{t('jobDetails.posted')} {new Date(post.date).toLocaleDateString(locale)}</span>
                </div>
              </div>
            </Card>
          )}

          {!isSender && proposalWithUserInfo?.userInfo?.aboutMe && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                {t('chat.about')} {proposal?.user.name}
              </h3>
              
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {proposalWithUserInfo.userInfo.aboutMe}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {proposal && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                {t('chat.proposalDetails')}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('jobDetails.status')}</p>
                  <Badge variant="success">{proposal.status}</Badge>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('chat.submitted')}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(proposal.date).toLocaleDateString(locale)}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">
                    {isSender ? t('chat.yourCoverLetter') : t('chat.freelancerCoverLetter')}
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {proposal.coverLetter}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {discussion?.shownContacts && discussion.shownContacts.length > 0 && (
            <ContactsDisplay
              contacts={isSender ? discussion.shownContacts: (proposalWithUserInfo.userInfo.contacts || [])}
              title={isSender ? t('chat.jobOwnersContacts') : t('chat.freelancersContacts')}
            />
          )}

          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 text-2xl">💡</div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  {t('chat.professionalCommunication')}
                </h4>
                <p className="text-sm text-blue-800">
                  {t('chat.keepProfessional')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}