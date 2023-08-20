import React from 'react';

import SideBar from '../components/Sidebar';
import getConversations from '@/app/actions/getConversations';
import ConversationList from './components/ConversationList';

const ConversationLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const conversations = await getConversations();

  return (
    <SideBar>
      <div className="h-full">{children}</div>
      <ConversationList initialConversation={conversations} />
    </SideBar>
  );
};

export default ConversationLayout;
