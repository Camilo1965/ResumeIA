'use client';

import { useState, useEffect } from 'react';
import { User, Phone, Mail, MapPin, Linkedin, Briefcase, GraduationCap, Code } from 'lucide-react';

interface ProfileRecord {
  profileId: number;
  completeName: string;
  technicalSkills: string;
  contactPhone: string;
  cityLocation: string;
  ownerName: string;
}

export function ProfileListingTable() {
  const [profileRecords, setProfileRecords] = useState<ProfileRecord[]>([]);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    fetchProfileRecords();
  }, []);

  const fetchProfileRecords = async () => {
    try {
      const apiResponse = await fetch('/api/user-profiles');
      const responseData = await apiResponse.json();
      setProfileRecords(responseData.profiles || []);
    } catch (err) {
      console.error('Failed to load profiles:', err);
      // Use mock data for demonstration
      setProfileRecords([
        {
          profileId: 1,
          completeName: 'Jane Smith',
          technicalSkills: 'React, Node.js, Python',
          contactPhone: '+1-555-0101',
          cityLocation: 'New York, NY',
          ownerName: 'Jane Smith',
        },
        {
          profileId: 2,
          completeName: 'Robert Johnson',
          technicalSkills: 'Java, Spring, AWS',
          contactPhone: '+1-555-0202',
          cityLocation: 'Austin, TX',
          ownerName: 'Robert Johnson',
        },
      ]);
    } finally {
      setLoadingState(false);
    }
  };

  const handleDeleteProfile = async (profileId: number) => {
    if (!confirm('Are you sure you want to delete this profile?')) {
      return;
    }

    try {
      const response = await fetch(`/api/user-profiles/${profileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile');
      }

      alert('Profile deleted successfully');
      fetchProfileRecords();
    } catch (err) {
      console.error('Error deleting profile:', err);
      alert('Failed to delete profile. Please try again.');
    }
  };

  if (loadingState) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary-dark text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Full Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Tech Stack</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Location</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Profile Owner</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {profileRecords.map((record) => (
              <tr key={record.profileId} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{record.profileId}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.completeName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.technicalSkills}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.contactPhone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.cityLocation}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{record.ownerName}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleDeleteProfile(record.profileId)}
                      className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      title="Delete"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => window.location.href = `/user-profiles/${record.profileId}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => window.location.href = `/user-profiles/${record.profileId}`}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      title="View"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {profileRecords.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <User size={48} className="mx-auto mb-4 opacity-50" />
          <p>No profiles found. Create your first profile to get started.</p>
        </div>
      )}
    </div>
  );
}
