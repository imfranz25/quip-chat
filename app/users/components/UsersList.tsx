'use client';

import React from 'react';
import { User } from '@prisma/client';

import Userbox from './Userbox';

interface UsersListProps {
  users: User[];
}

const UsersList: React.FC<UsersListProps> = ({ users }) => {
  return (
    <aside className="fixed inset-y-0 pb-20  lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-gray-200 block w-full left-0">
      <div className="px-5">
        <div className="flex-col">
          <div className="text-2xl font-bold text-neutral-800 py-4">
            Quip Chats
          </div>
        </div>
        {users.map((user) => (
          <Userbox key={user.id} user={user} />
        ))}
      </div>
    </aside>
  );
};

export default UsersList;
