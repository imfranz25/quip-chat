'use client';

import clsx from 'clsx';
import React, { useCallback } from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';

interface DesktopItemProps {
  label: string;
  icon: IconType;
  href: string;
  onClick?: () => void;
  active?: boolean;
}

const DesktopItem: React.FC<DesktopItemProps> = ({
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
    <li onClick={handleClick}>
      <Link
        href={href}
        className={clsx(
          `group
          flex
          gap-x-3
          rounded-md
          p-3
          text-sm
          leading-6
          font-semibold
          text-gray-500
          hover:text-black
          hover:bg-gray-100`,
          active && 'bg-gray-100 text-black',
        )}
      >
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  );
};

export default DesktopItem;