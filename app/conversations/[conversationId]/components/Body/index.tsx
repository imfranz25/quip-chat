'use client';

import axios from 'axios';
import React, { useState, useRef, useEffect, useCallback } from 'react';

import { find } from 'lodash';
import MessageBox from '../MessageBox';
import { FullMessageType } from '@/app/types';
import useConversation from '@/app/hooks/useConversation';
import { pusherClient } from '@/app/libs/pusherSocket';

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { conversationId } = useConversation();

  const messageHandler = useCallback(
    (message: FullMessageType) => {
      setMessages((current) => {
        axios.post(`/api/conversations/${conversationId}/seen`);

        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    },
    [conversationId],
  );

  const updateMessageHandler = useCallback((newMessage: FullMessageType) => {
    setMessages((current) =>
      current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) {
          return newMessage;
        }

        return currentMessage;
      }),
    );
  }, []);

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('messages:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('messages:update', updateMessageHandler);
    };
  }, [conversationId, messageHandler, updateMessageHandler]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageBox
          key={message.id}
          message={message}
          isLast={index === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  );
};

export default Body;
