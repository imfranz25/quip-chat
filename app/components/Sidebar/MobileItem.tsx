'use client';

import clsx from 'clsx';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { IconType } from 'react-icons';

interface MobileItemProps {
  label: string;
  icon: IconType;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const MobileItem: React.FC<MobileItemProps> = ({
  href,
  label,
  active,
  onClick,
  icon: Icon,
}) => {
  const handleClick = useCallback(() => {
    if (onClick) {
      return onClick();
    }
  }, [onClick]);

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        `group
        flex
        gap-x-3
        text-sm
        leading-6
        font-semibold
        w-full
        justify-center
        p-4
        text-gray
        hover:text-black
        hover:bg-gray-100`,
        active && 'bg-gray-100 text-black',
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="sr-only">{label}</span>
    </Link>
  );
};

export default MobileItem;
