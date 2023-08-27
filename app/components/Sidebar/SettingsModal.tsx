'use client';

import clsx from 'clsx';
import axios from 'axios';
import Image from 'next/image';
import { User } from '@prisma/client';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import Modal from '../Modal';
import Input from '../Input';
import { fileToBase64 } from '@/app/libs/filetoBase64';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  });

  const image = watch('image');
  const handleUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files) return;

      const file = event.target.files[0];

      if (!file) return;

      const base64 = await fileToBase64(file);

      setValue('image', base64, { shouldValidate: true });
    },
    [setValue],
  );

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      setIsLoading(true);

      try {
        await axios.post('/api/settings', data);

        router.refresh();
        onClose();
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    [onClose, router],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your profile information
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                register={register}
                required
              />
            </div>
            <div>
              <label
                htmlFor=""
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Photo
              </label>
              <div className="mt-2 flex items-center gap-x-3">
                <Image
                  width={48}
                  height={48}
                  alt="Avatar"
                  className="rounded-full"
                  src={image || currentUser?.image || '/images/avatar.jpg'}
                />
                <div>
                  <label
                    htmlFor="image-upload"
                    className={clsx(
                      `border py-2 px-3 cursor-pointer rounded-md bg-sky-500 text-white`,
                      isLoading && 'cursor-not-allowed',
                    )}
                  >
                    Upload
                  </label>

                  <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    disabled={isLoading}
                    onChange={handleUpload}
                    accept="image/png, image/jpg, image/jpeg"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center"></div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
