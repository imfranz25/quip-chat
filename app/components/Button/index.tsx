'use client';

import clsx from 'clsx';
import React from 'react';

interface ButtonProps {
  danger?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  secondary?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

const Button: React.FC<ButtonProps> = ({
  type,
  children,
  danger = false,
  disabled = false,
  fullWidth = false,
  secondary = false,
  onClick = () => {},
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        `flex
        px-3
        py-2
        text-sm
        rounded-md
        font-semibold
        justify-center
        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2`,
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        secondary ? 'text-gray-900' : 'text-white',
        danger &&
          'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
        !secondary &&
          !danger &&
          'bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600',
      )}
    >
      {children}
    </button>
  );
};

export default Button;
