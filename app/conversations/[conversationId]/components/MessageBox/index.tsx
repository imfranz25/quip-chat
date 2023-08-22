'use client';

import clsx from 'clsx';
import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';

import { FullMessageType } from '@/app/types';
import Avatar from '@/app/components/Sidebar/Avatar';

interface MessageBoxProps {
  isLast: boolean;
  message: FullMessageType;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, isLast }) => {
  const session = useSession();
  const isOwn = session?.data?.user?.email === message?.sender?.email;
  const seenList = (message?.seen || [])
    .filter((user) => user.email !== message.sender.email)
    .map((user) => user.name)
    .join(', ');

  const container = clsx(`flex gap-3 p-4`, isOwn && 'justify-end');
  const avatar = clsx(isOwn && 'order-2');
  const body = clsx(`flex flex-col gap-2`, isOwn && 'items-end');
  const messageText = clsx(
    `text-sm w-fit overflow-hidden`,
    isOwn ? 'bg-sky-500 text-white' : 'bg-gray-100',
    message.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3',
  );

  console.log({ isLast });
  console.log({ seenList });

  return (
    <div className={container}>
      <div className={avatar}>
        <Avatar user={message.sender} />
      </div>
      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">{message.sender.name}</div>
          <div className="text-xs text-gray-400">
            {format(new Date(message.createdAt), 'p')}
          </div>
        </div>
        <div className={messageText}>
          {message.image ? (
            <Image
              alt="Image"
              width="288"
              height="288"
              src={message.image}
              className="object-cover cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div>{message.body}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
