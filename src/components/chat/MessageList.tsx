'use client';

import { useEffect, useRef } from 'react';
import { Message } from '@/types';
import { useAuthStore } from '@/lib/store/authStore';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const userScrolledRef = useRef(false);

  // Track if user has manually scrolled up
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50; // 50px threshold
    
    userScrolledRef.current = !isAtBottom;
  };

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    // Only auto-scroll if:
    // 1. New messages were added (length increased)
    // 2. User hasn't manually scrolled up
    const messagesIncreased = messages.length > prevMessagesLengthRef.current;
    
    if (messagesIncreased && !userScrolledRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {messages.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No messages yet. Start the conversation!
        </p>
      ) : (
        messages.map((msg) => {
          const isCurrentUser = msg.user.id === user?.id;
          
          return (
            <div
              key={msg.messageId}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isCurrentUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                <p className="font-semibold text-sm">{msg.user.name}</p>
                <p className="mt-1">{msg.message}</p>
                <p className="text-xs mt-2 opacity-70">
                  {new Date(msg.date).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}