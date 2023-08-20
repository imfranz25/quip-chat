import { User } from '@prisma/client';
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';

import { FullConversationType } from '../types';

const useOtherUser = (
  conversation: FullConversationType | { users: User[] },
) => {
  const session = useSession();
  const otherUser = useMemo(() => {
    const currentUserEmail = session?.data?.user?.email;
    const [oppositeUser] = conversation.users.filter(
      (user) => user.email !== currentUserEmail,
    );

    return oppositeUser;
  }, [conversation.users, session?.data?.user?.email]);

  return otherUser;
};

export default useOtherUser;
