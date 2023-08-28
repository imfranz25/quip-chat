'use client';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';

import { AuthVariant } from '@/app/types';
import Input from '@/app/components/Input';
import Button from '@/app/components/Button';
import AuthSocialButton from '../AuthSocialButton';

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<AuthVariant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users');
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (isLoading) return;

    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant, isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      await axios
        .post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Something went wrong'))
        .finally(() => setIsLoading(false));
    }

    if (variant === 'LOGIN') {
      const authResponse = await signIn('credentials', {
        ...data,
        redirect: false,
      });

      if (authResponse?.error) {
        toast.error('Invalid credentials');
        setIsLoading(false);
      }

      if (authResponse?.ok && !authResponse?.error) {
        toast.success('Login success');
        router.push('/users');
      }
    }
  };

  const socialActions = useCallback(
    async (action: string) => {
      if (isLoading) return;

      setIsLoading(true);

      const socialAuthResponse = await signIn(action, { redirect: false });

      if (socialAuthResponse?.error) {
        toast.error('Invalid credentials');
      }

      if (socialAuthResponse?.ok && !socialAuthResponse?.error) {
        toast.success('Login success');
      }

      setIsLoading(false);
    },
    [isLoading],
  );

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {variant === 'REGISTER' && (
            <Input
              id="name"
              label="Name"
              errors={errors}
              register={register}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            type="email"
            errors={errors}
            register={register}
            disabled={isLoading}
            label="Email address"
          />
          <Input
            id="password"
            type="password"
            label="Password"
            errors={errors}
            register={register}
            disabled={isLoading}
          />
          {variant === 'REGISTER' && (
            <Input
              type="password"
              errors={errors}
              register={register}
              disabled={isLoading}
              id="confirmPassword"
              label="Confirm Password"
            />
          )}
          <div>
            <Button fullWidth disabled={isLoading} type="submit">
              {variant === 'LOGIN' ? 'Sign-in' : 'Sign-up'}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-6">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialActions('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialActions('google')}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === 'LOGIN'
              ? 'New to quip chat?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
