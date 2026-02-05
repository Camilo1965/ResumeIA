'use client';

import { useState, useEffect } from 'react';
import { Eye, Download, Share2, Filter } from 'lucide-react';

interface CVHistoryRecord {
  cvId: number;
  profileOwnerName: string;
  organizationName: string;
  positionTitle: string;
  lastModifiedDate: string;
}

export function HistoryDataTable() {
  const [historyRecords, setHistoryRecords] = useState<CVHistoryRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [filterProfileName, setFilterProfileName] = useState('');
  const [filterCompanyName, setFilterCompanyName] = useState('');

  useEffect(() => {
    fetchHistoryRecords();
  }, []);

  const fetchHistoryRecords = async () => {
    try {
      const apiResponse = await fetch('/api/cv-history');
      const responseData = await apiResponse.json();
      setHistoryRecords(responseData.cvHistory || []);
    } catch (err) {
      console.error('Failed to load history:', err);
      // Use mock data
      setHistoryRecords([
        {
          cvId: 1,
          profileOwnerName: 'Jane Smith',
          organizationName: 'TechCorp Inc',
          positionTitle: 'Senior Developer',
          lastModifiedDate: '2024-01-15',
        },
        {
          cvId: 2,
          profileOwnerName: 'Robert Johnson',
          organizationName: 'StartupXYZ',
          positionTitle: 'Full Stack Engineer',
          lastModifiedDate: '2024-01-10',
        },
      ]);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const filteredRecords = historyRecords.filter((record) => {
    const matchesProfile = filterProfileName === '' || 
      record.profileOwnerName.toLowerCase().includes(filterProfileName.toLowerCase());
    const matchesCompany = filterCompanyName === '' || 
      record.organizationName.toLowerCase().includes(filterCompanyName.toLowerCase());
    return matchesProfile && matchesCompany;
  });

  const handleViewCV = (cvId: number) => {
    console.log('View CV:', cvId);
    alert(`View CV #${cvId} - Feature coming soon`);
  };

  const handleDownloadCV = (cvId: number) => {
    console.log('Download CV:', cvId);
    alert(`Download CV #${cvId} - Feature coming soon`);
  };

  const handleShareCV = (cvId: number) => {
    console.log('Share CV:', cvId);
    alert(`Share CV #${cvId} - Feature coming soon`);
  };

  if (isLoadingRecords) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Profile Name</label>
            <input
              type="text"
              value={filterProfileName}
              onChange={(e) => setFilterProfileName(e.target.value)}
              className="input-field"
              placeholder="Filter by profile name..."
            />
          </div>
          <div>
            <label className="label-text">Company Name</label>
            <input
              type="text"
              value={filterCompanyName}
              onChange={(e) => setFilterCompanyName(e.target.value)}
              className="input-field"
              placeholder="Filter by company name..."
            />
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary-dark text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">No</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Profile Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Company Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Position</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date Edited</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record, index) => (
                <tr key={record.cvId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {record.profileOwnerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.organizationName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.positionTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.lastModifiedDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewCV(record.cvId)}
                        className="text-accent-teal hover:text-teal-700"
                        title="View CV"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownloadCV(record.cvId)}
                        className="text-accent-gold hover:text-yellow-600"
                        title="Download CV"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleShareCV(record.cvId)}
                        className="text-primary hover:text-primary-dark"
                        title="Share Link"
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No CV history found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
