import { useMemo } from 'react';
import { HiChat } from 'react-icons/hi';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { HiArrowLeftOnRectangle, HiUsers } from 'react-icons/hi2';

import useConversation from './useConversation';

const useRoutes = () => {
  const pathName = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(
    () => [
      {
        label: 'Chat',
        icon: HiChat,
        href: '/conversations',
        active: pathName === '/conversations' || !!conversationId,
      },
      {
        label: 'Users',
        icon: HiUsers,
        href: '/users',
        active: pathName === '/users',
      },
      {
        label: 'Logout',
        href: '#',
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathName, conversationId],
  );

  return routes;
};

export default useRoutes;
