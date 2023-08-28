/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import React from 'react';
import ReactSelect from 'react-select';

interface SelectProps {
  label: string;
  disabled?: boolean;
  value?: Record<string, any>;
  options: Record<string, any>[];
  onChange: (value: Record<string, any>) => void;
}

const Select: React.FC<SelectProps> = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="z-[100]">
      <label
        htmlFor=""
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isMulti
          value={value}
          options={options}
          onChange={onChange}
          isDisabled={disabled}
          menuPortalTarget={document.body}
          classNames={{ control: () => 'text-sm' }}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
        />
      </div>
    </div>
  );
};

export default Select;
