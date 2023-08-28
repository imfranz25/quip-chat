'use client';

import axios from 'axios';
import Image from 'next/image';
import toast from 'react-hot-toast';
import React, { useCallback, useState } from 'react';
import { HiPhoto, HiPaperAirplane } from 'react-icons/hi2';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import MessageInput from '../MessageInput';
import { fileToBase64 } from '@/app/libs/filetoBase64';
import useConversation from '@/app/hooks/useConversation';

const Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { conversationId } = useConversation();
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
      image: '',
    },
  });

  const image = watch('image');
  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      try {
        setIsLoading(true);
        setValue('message', '', { shouldValidate: true });
        setValue('image', '', { shouldValidate: true });

        await axios.post('/api/messages', {
          ...data,
          conversationId,
        });

        toast.success('Message sent');
      } catch (error) {
        toast.error('Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, setValue],
  );

  const cancelUpload = useCallback(() => {
    if (isLoading) return;

    setValue('image', '', { shouldValidate: true });
  }, [setValue, isLoading]);

  const handleUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isLoading || !event.target.files) return;

      const file = event.target.files[0];

      if (!file) return;

      const base64 = await fileToBase64(file);

      setValue('image', base64, { shouldValidate: true });
    },
    [setValue, isLoading],
  );

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <label htmlFor="fileUpload">
        <HiPhoto
          size={30}
          className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
        />
      </label>
      <input
        type="file"
        id="fileUpload"
        className="hidden"
        disabled={isLoading}
        onChange={handleUpload}
        accept="image/png, image/jpg, image/jpeg"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        {image && (
          <div
            onClick={cancelUpload}
            className="relative w-10 h-8 cursor-pointer border border-gray-500 rounded-md"
          >
            <Image
              src={image}
              alt="Uploaded Image"
              className="rounded-md"
              fill
            />
            <AiFillCloseCircle className="absolute z-20 text-red-500 -right-1 -top-1 p-0 m-0" />
          </div>
        )}
        <MessageInput
          id="message"
          errors={errors}
          register={register}
          required={image ? false : true}
          placeholder="Write a message"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
