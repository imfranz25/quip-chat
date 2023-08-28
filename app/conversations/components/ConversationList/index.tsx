'use client';

import clsx from 'clsx';
import { User } from '@prisma/client';
import React, { useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';

import GroupChatModal from '../GroupChatModal';
import ConversationBox from '../ConversationBox';
import { FullConversationType } from '@/app/types';
import useConversation from '@/app/hooks/useConversation';

interface ConversationListProps {
  users: User[];
  initialConversation: FullConversationType[];
}

const ConversationList: React.FC<ConversationListProps> = ({
  users,
  initialConversation,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convoItems, setConvoItems] = useState(initialConversation);
  const { conversationId, isOpen } = useConversation();

  console.log({ setConvoItems });

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
