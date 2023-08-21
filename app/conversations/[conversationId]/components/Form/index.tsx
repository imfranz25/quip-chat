'use client';

import axios from 'axios';
import React, { useCallback } from 'react';
import { HiPhoto, HiPaperAirplane } from 'react-icons/hi2';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import MessageInput from '../MessageInput';
import useConversation from '@/app/hooks/useConversation';

const Form = () => {
  const { conversationId } = useConversation();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = useCallback(
    async (data) => {
      setValue('message', '', { shouldValidate: true });

      await axios.post('/api/message', {
        ...data,
        conversationId,
      });
    },
    [conversationId, setValue],
  );

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <HiPhoto
        size={30}
        className="text-sky-500 cursor-pointer hover:text-sky-600 transition"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          placeholder="Write a message"
          required
        />
        <button
          type="submit"
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;
