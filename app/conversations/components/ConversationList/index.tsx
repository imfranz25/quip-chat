'use client';

import clsx from 'clsx';
import { find } from 'lodash';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';

import GroupChatModal from '../GroupChatModal';
import ConversationBox from '../ConversationBox';
import { FullConversationType } from '@/app/types';
import useConversation from '@/app/hooks/useConversation';
import { pusherClient } from '@/app/libs/pusherSocket';
import { useRouter } from 'next/navigation';

interface ConversationListProps {
  users: User[];
  initialConversation: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  users,
  initialConversation,
}) => {
  const router = useRouter();
  const session = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convoItems, setConvoItems] = useState(initialConversation);
  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  const newHandler = useCallback((conversation: FullConversationType) => {
    setConvoItems((current) => {
      if (find(current, { id: conversation.id })) {
        return current;
      }

      return [conversation, ...current];
    });
  }, []);

  const updateHandler = useCallback((conversation: FullConversationType) => {
    setConvoItems((current) =>
      current.map((currentConversation) => {
        if (currentConversation.id === conversation.id) {
          return {
            ...currentConversation,
            messages: conversation.messages,
          };
        }

        return currentConversation;
      }),
    );
  }, []);

  const removeHandler = useCallback(
    (conversation: FullConversationType) => {
      setConvoItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)];
      });

      if (conversationId === conversation.id) {
        router.push('/conversations');
      }
    },
    [router, conversationId],
  );

  useEffect(() => {
    if (!pusherKey) return;

    pusherClient.subscribe(pusherKey);
    pusherClient.bind('conversation:new', newHandler);
    pusherClient.bind('conversation:update', updateHandler);
    pusherClient.bind('conversation:remove', removeHandler);

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('conversation:new', newHandler);
      pusherClient.unbind('conversation:update', updateHandler);
      pusherClient.unbind('conversation:remove', removeHandler);
    };
  }, [pusherKey, newHandler, updateHandler, removeHandler]);

  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(
          `fixed
          inset-y-0
          pb-20
          lg:pb-0
          lg:left-20
          lg:w-80
          lg:block
          overflow-y-auto
          border-r
          border-gray-200`,
          isOpen ? 'hidden' : 'block w-full left-0',
        )}
      >
        <div className="px-5">
          <div className="flex justify-between mb-4 pt-4">
            <div className="text-2xl font-bold text-neutral-800">Messages</div>
            <div
              className="cursor-pointer rounded-full p-2 bg-gray-100 text-gray-600 hover:opacity-75 transition"
              onClick={() => setIsModalOpen(true)}
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>
          {convoItems.map((convo) => (
            <ConversationBox
              key={convo.id}
              conversation={convo}
              selected={conversationId === convo.id}
            />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ConversationList;
