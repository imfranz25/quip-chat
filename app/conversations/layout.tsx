import React from 'react';

import SideBar from '../components/Sidebar';
import getConversations from '@/app/actions/getConversations';
import ConversationList from './components/ConversationList';
import getUsers from '../actions/getUsers';

const ConversationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const conversations = await getConversations();
  const users = await getUsers();

  return (
    <SideBar>
      <div className="h-full">{children}</div>
      <ConversationList users={users} initialConversation={conversations} />
    </SideBar>
  );
};

export default ConversationLayout;
