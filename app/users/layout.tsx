import React from 'react';

import getUsers from '../actions/getUsers';
import SideBar from '../components/Sidebar';
import UsersList from './components/UsersList';

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {
  const users = await getUsers();

  return (
    <SideBar>
      <div className="h-full">
        <UsersList users={users} />
        {children}
      </div>
    </SideBar>
  );
};

export default UsersLayout;
