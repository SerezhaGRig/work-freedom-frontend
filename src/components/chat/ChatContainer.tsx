'use client';

import { Message } from '@/types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface ChatContainerProps {
  messages: Message[];
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
}

export function ChatContainer({
  messages,
  newMessage,
  onMessageChange,
  onSendMessage,
}: ChatContainerProps) {
  return (
    <>
      <MessageList messages={messages} />
      <MessageInput
        value={newMessage}
        onChange={onMessageChange}
        onSend={onSendMessage}
      />
    </>
  );
}