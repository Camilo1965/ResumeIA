'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LoginFormComponent } from '@/components/auth-ui/LoginFormComponent';
import { OAuthButtons } from '@/components/auth-ui/OAuthButtons';
import { CheckCircle, FileText } from 'lucide-react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const showRegistrationSuccess = searchParams.get('registered') === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back to Resume AI
          </h1>
          <p className="text-gray-600">Sign in to build your perfect resume</p>
        </div>

        {/* Success Message */}
        {showRegistrationSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start animate-fade-in">
            <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Account created successfully!</p>
              <p className="text-sm text-green-700 mt-1">Please sign in with your new account.</p>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 card-shadow">
          <LoginFormComponent />

          <div className="mt-6">
            <OAuthButtons />
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/register"
                className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              <Link
                href="/"
                className="font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                ← Back to home
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to Resume AI's Terms of Service
        </p>
      </div>
    </div>
  );
}
