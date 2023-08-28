'use client';

import axios from 'axios';
import { User } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react';
import { FieldValues, SubmitErrorHandler, useForm } from 'react-hook-form';

import Modal from '@/app/components/Modal';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import Select from '@/app/components/Input/Select';

interface GroupChatModalProps {
  users: User[];
  isOpen: boolean;
  onClose: () => void;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
  users,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: [],
    },
  });

  const members = watch('members');
  const onSubmit: SubmitErrorHandler<FieldValues> = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        await axios.post('/api/conversations', {
          ...data,
          isGroup: true,
        });

        toast.success('Group chat created');
        router.refresh();
        onClose();
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    [router, onClose],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Create a quip group chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Create a chat with more than 2 people
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                required
                id="name"
                label="Name"
                register={register}
                errors={errors}
                disabled={isLoading}
              />
              <Select
                value={members}
                label="Members"
                disabled={isLoading}
                onChange={(value) =>
                  setValue('members', value, { shouldValidate: true })
                }
                options={users.map((user) => ({
                  value: user.id,
                  label: user.name,
                }))}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            secondary
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupChatModal;
