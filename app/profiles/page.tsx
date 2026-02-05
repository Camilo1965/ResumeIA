'use client';

import { useState } from 'react';
import { ProfileListingTable } from '@/components/profile-manager/ProfileListingTable';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProfilesIndexPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Profiles</h1>
        <Link
          href="/profiles/new"
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Profile</span>
        </Link>
      </div>

      <ProfileListingTable />
    </div>
  );
}
