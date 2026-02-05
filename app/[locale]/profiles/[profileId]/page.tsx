'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProfileEditorForm } from '@/components/profile-manager/ProfileEditorForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfileDetailPage() {
  const params = useParams();
  const router = useRouter();
  const profileIdentifier = params.profileId as string;
  const isCreatingNew = profileIdentifier === 'new';

  const [profileData, setProfileData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(!isCreatingNew);

  useEffect(() => {
    if (!isCreatingNew) {
      loadProfileData();
    }
  }, [profileIdentifier]);

  const loadProfileData = async () => {
    try {
      const apiResponse = await fetch(`/api/profiles/${profileIdentifier}`);
      const responseData = await apiResponse.json();
      setProfileData(responseData.profile);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleProfileSave = async (formData: any) => {
    try {
      const apiEndpoint = isCreatingNew
        ? '/api/profiles'
        : `/api/profiles/${profileIdentifier}`;

      const apiMethod = isCreatingNew ? 'POST' : 'PUT';

      const apiResponse = await fetch(apiEndpoint, {
        method: apiMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to save profile');
      }

      alert('Profile saved successfully!');
      router.push('/profiles');
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Please try again.');
    }
  };

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/profiles"
        className="inline-flex items-center space-x-2 text-accent-teal hover:text-teal-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Profiles</span>
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isCreatingNew ? 'Create New Profile' : 'Edit Profile'}
      </h1>

      <div className="bg-white rounded-lg shadow-lg p-6 card-shadow max-w-4xl">
        <ProfileEditorForm
          existingProfileData={profileData}
          onSaveProfile={handleProfileSave}
        />
      </div>
    </div>
  );
}
