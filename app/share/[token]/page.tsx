'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function SharePage() {
  const params = useParams();
  const token = params.token as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      // Decode the token to get CV ID
      try {
        // Handle base64url decoding in the browser
        const decoded = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
        const [cvId] = decoded.split('-');
        
        // Redirect to the PDF view
        window.location.href = `/api/resume/${cvId}/pdf`;
      } catch (e) {
        setError('Invalid share link');
        setLoading(false);
      }
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return null;
}
