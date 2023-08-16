'use client';

import { useCallback, useState } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';

import { AuthVariant } from '../../types';

const AuthForm = () => {
  const [variant, setVariant] = useState<AuthVariant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      // Register API
    } else {
      // Next Auth Sign in
    }

    setIsLoading(false);
  };

  const socialActions = (action: string) => {
    setIsLoading(true);

    // Social Sign in

    setIsLoading(false);
  };

  return <div>AuthForm2</div>;
};

export default AuthForm;
