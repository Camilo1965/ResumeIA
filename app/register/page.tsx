'use client';

import Link from 'next/link';
import { SignupFormComponent } from '@/components/auth-ui/SignupFormComponent';
import { OAuthButtons } from '@/components/auth-ui/OAuthButtons';
import { FileText, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Resume AI
          </h1>
          <p className="text-gray-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
            Create AI-powered resumes in minutes
          </p>
        </div>

        {/* Features Banner */}
        <div className="mb-6 bg-gradient-to-r from-purple-100 to-cyan-100 rounded-xl p-4">
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">✓</span>
              <span>AI-powered resume generation</span>
            </li>
            <li className="flex items-start">
              <span className="text-cyan-600 mr-2">✓</span>
              <span>Multiple professional templates</span>
            </li>
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">✓</span>
              <span>Unlimited resume downloads</span>
            </li>
          </ul>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 card-shadow">
          <SignupFormComponent />

          <div className="mt-6">
            <OAuthButtons />
          </div>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-purple-600 hover:text-purple-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          By creating an account, you agree to Resume AI's{' '}
          <a href="#" className="underline hover:text-gray-700">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-gray-700">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
