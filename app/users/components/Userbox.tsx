'use client';

import axios from 'axios';
import { User } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';

import Avatar from '@/app/components/Sidebar/Avatar';
import LoadingModal from '@/app/components/LoadingModal';

interface UserboxProps {
  user: User;
}

const Userbox: React.FC<UserboxProps> = ({ user }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/conversations', {
        userId: user.id,
      });

      router.push(`/conversations/${response.data.id}`);
    } catch (error: unknown) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [user.id, router]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
      >
        <Avatar user={user} />
        <div className="min-2-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Userbox;
