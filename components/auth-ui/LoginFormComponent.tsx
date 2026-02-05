'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ResumeAILoginFormInputs {
  emailAddress: string;
  userPassword: string;
}

export function LoginFormComponent() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authenticationError, setAuthenticationError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResumeAILoginFormInputs>();

  const processLoginSubmission = async (formData: ResumeAILoginFormInputs) => {
    setIsAuthenticating(true);
    setAuthenticationError('');

    try {
      const authenticationResult = await signIn('resumeai-login', {
        emailAddress: formData.emailAddress,
        userPassword: formData.userPassword,
        redirect: false,
      });

      if (authenticationResult?.error) {
        setAuthenticationError('Invalid email or password. Please try again.');
        setIsAuthenticating(false);
        return;
      }

      if (authenticationResult?.ok) {
        router.push('/profiles');
      }
    } catch (error) {
      setAuthenticationError('Authentication service error. Please try again.');
      setIsAuthenticating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processLoginSubmission)} className="space-y-5">
      {/* Email Address Field */}
      <div>
        <label htmlFor="emailAddress" className="label-text">
          Email Address
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="emailAddress"
            type="email"
            {...register('emailAddress', {
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address format',
              },
            })}
            className="input-field pl-10"
            placeholder="Enter your email"
            disabled={isAuthenticating}
          />
        </div>
        {errors.emailAddress && (
          <p className="mt-1 text-sm text-red-600">{errors.emailAddress.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="userPassword" className="label-text">
          Password
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="userPassword"
            type="password"
            {...register('userPassword', {
              required: 'Password is required',
            })}
            className="input-field pl-10"
            placeholder="Enter your password"
            disabled={isAuthenticating}
          />
        </div>
        {errors.userPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.userPassword.message}</p>
        )}
      </div>

      {/* Authentication Error Display */}
      {authenticationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{authenticationError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isAuthenticating}
        className="w-full btn-primary flex items-center justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAuthenticating ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Signing in...
          </>
        ) : (
          'Sign In to Resume AI'
        )}
      </button>
    </form>
  );
}
