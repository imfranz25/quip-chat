'use client';

import React from 'react';
// import { signOut } from 'next-auth/react';

import EmptyState from '../components/EmptyState';

const Users = () => {
  return (
    <main className="hidden lg:block lg:pl-80 h-full">
      <EmptyState />
    </main>
  );
};

export default Users;
