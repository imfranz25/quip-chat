'use client';

import React from 'react';
import clsx from 'clsx';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface InputProps {
  id: string;
  type?: string;
  label: string;
  disabled?: boolean;
  required?: boolean;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  errors,
  register,
  type = 'text',
  required = false,
  disabled = false,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        disabled={disabled}
        {...register(id, { required })}
        className={clsx(
          `w-full
          ring-1
          border-0
          shadow-sm
          rounded-md
          ring-inset
          form-input
          focus:ring-2
          sm:leading-6
          focus:ring-inset
          ring-gray-300
          py-1.5text-gray-900
          placeholder:text-gray-400
          focus:ring-sky-600sm:text-sm`,
          errors[id] && 'focus:ring-rose-500',
          disabled && 'opacity-50 cursor-default',
        )}
      />
    </div>
  );
};

export default Input;
