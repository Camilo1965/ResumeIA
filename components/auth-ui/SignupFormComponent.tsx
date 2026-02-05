'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ResumeAISignupFormInputs {
  fullName: string;
  emailAddress: string;
  userPassword: string;
  confirmPassword: string;
}

export function SignupFormComponent() {
  const router = useRouter();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [registrationError, setRegistrationError] = useState<string>('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResumeAISignupFormInputs>();

  const passwordFieldValue = watch('userPassword');

  const processSignupSubmission = async (formData: ResumeAISignupFormInputs) => {
    setIsCreatingAccount(true);
    setRegistrationError('');

    try {
      const registrationResponse = await fetch('/api/auth/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await registrationResponse.json();

      if (!registrationResponse.ok) {
        setRegistrationError(responseData.message || 'Registration failed');
        setIsCreatingAccount(false);
        return;
      }

      setRegistrationSuccess(true);
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 2000);
    } catch (error) {
      setRegistrationError('Network error. Please try again.');
      setIsCreatingAccount(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(processSignupSubmission)} className="space-y-5">
      {/* Full Name Field */}
      <div>
        <label htmlFor="fullName" className="label-text">
          Full Name
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="fullName"
            type="text"
            {...register('fullName', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
            className="input-field pl-10"
            placeholder="Enter your full name"
            disabled={isCreatingAccount || registrationSuccess}
          />
        </div>
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
        )}
      </div>

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
            disabled={isCreatingAccount || registrationSuccess}
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
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
            })}
            className="input-field pl-10"
            placeholder="Create a password"
            disabled={isCreatingAccount || registrationSuccess}
          />
        </div>
        {errors.userPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.userPassword.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label htmlFor="confirmPassword" className="label-text">
          Confirm Password
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === passwordFieldValue || 'Passwords do not match',
            })}
            className="input-field pl-10"
            placeholder="Confirm your password"
            disabled={isCreatingAccount || registrationSuccess}
          />
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Error Display */}
      {registrationError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{registrationError}</p>
        </div>
      )}

      {/* Success Display */}
      {registrationSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <p className="text-sm text-green-700">
            Account created! Redirecting to login...
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isCreatingAccount || registrationSuccess}
        className="w-full btn-primary flex items-center justify-center py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreatingAccount ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Creating Account...
          </>
        ) : registrationSuccess ? (
          'Account Created!'
        ) : (
          'Create Resume AI Account'
        )}
      </button>
    </form>
  );
}
