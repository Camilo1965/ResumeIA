'use client';

import { useState, useEffect } from 'react';
import { Eye, Download, Share2, ChevronLeft, ChevronRight } from 'lucide-react';

interface CVHistoryRecord {
  cvId: number;
  profileOwnerName: string;
  organizationName: string;
  positionTitle: string;
  lastModifiedDate: string;
  pdfUrl: string;
  shareUrl: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function HistoryDataTable() {
  const [historyRecords, setHistoryRecords] = useState<CVHistoryRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [filterProfileName, setFilterProfileName] = useState('');
  const [filterCompanyName, setFilterCompanyName] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [previewCVId, setPreviewCVId] = useState<number | null>(null);

  useEffect(() => {
    fetchHistoryRecords();
  }, [pagination.page, pagination.limit, filterProfileName, filterCompanyName]);

  const fetchHistoryRecords = async () => {
    setIsLoadingRecords(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (filterProfileName) {
        params.append('profileName', filterProfileName);
      }
      if (filterCompanyName) {
        params.append('companyName', filterCompanyName);
      }

      const apiResponse = await fetch(`/api/history?${params}`);
      const responseData = await apiResponse.json();
      
      setHistoryRecords(responseData.data || []);
      setPagination(responseData.pagination || pagination);
    } catch (err) {
      console.error('Failed to load history:', err);
      // Use mock data
      setHistoryRecords([
        {
          cvId: 1,
          profileOwnerName: 'Camilo Gonzalez',
          organizationName: 'caseware',
          positionTitle: 'Senior Software Developer, AI Platform',
          lastModifiedDate: '2026-02-05 01:15',
          pdfUrl: '/api/resume/1/pdf',
          shareUrl: '/share/abc123',
        },
        {
          cvId: 2,
          profileOwnerName: 'Camilo Gonzalez',
          organizationName: 'Svitla',
          positionTitle: 'Sr FullStack AI Engineer',
          lastModifiedDate: '2026-02-05 01:00',
          pdfUrl: '/api/resume/2/pdf',
          shareUrl: '/share/def456',
        },
        {
          cvId: 3,
          profileOwnerName: 'Camilo Gonzalez',
          organizationName: 'NuBank',
          positionTitle: 'Senior Software Engineer',
          lastModifiedDate: '2026-02-05 00:55',
          pdfUrl: '/api/resume/3/pdf',
          shareUrl: '/share/ghi789',
        },
      ]);
      setPagination({ page: 1, limit: 15, total: 3, totalPages: 1 });
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleViewCV = (cvId: number) => {
    // Open PDF in a new window for preview
    window.open(`/api/resume/${cvId}/pdf`, '_blank');
  };

  const handleDownloadCV = async (cvId: number) => {
    try {
      const response = await fetch(`/api/resume/${cvId}/pdf`);
      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from content-disposition header if available
      const contentDisposition = response.headers.get('content-disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `CV_${cvId}.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSuccessToast('PDF downloaded successfully!');
    } catch (error) {
      console.error('Failed to download CV:', error);
      showSuccessToast('Failed to download PDF');
    }
  };

  const handleShareCV = async (cvId: number) => {
    try {
      const response = await fetch(`/api/resume/${cvId}/share`);
      const data = await response.json();
      
      // Copy to clipboard
      await navigator.clipboard.writeText(data.shareUrl);
      showSuccessToast('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to share CV:', error);
      showSuccessToast('Failed to copy link');
    }
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination({ ...pagination, limit: newLimit, page: 1 });
  };

  if (isLoadingRecords) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  const startIndex = (pagination.page - 1) * pagination.limit;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header with Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="flex-1">
              <label className="label-text">Profile Name</label>
              <input
                type="text"
                value={filterProfileName}
                onChange={(e) => {
                  setFilterProfileName(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="input-field"
                placeholder="Search by profile name..."
              />
            </div>
            <div className="flex-1">
              <label className="label-text">Company Name</label>
              <input
                type="text"
                value={filterCompanyName}
                onChange={(e) => {
                  setFilterCompanyName(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="input-field"
                placeholder="Search by company name..."
              />
            </div>
          </div>
          <div className="flex items-end">
            <div>
              <label className="label-text">Items per page</label>
              <select
                value={pagination.limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="input-field w-32"
              >
                <option value="15">15 / page</option>
                <option value="30">30 / page</option>
                <option value="50">50 / page</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Profile Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Company Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Position</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date Edited</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historyRecords.map((record, index) => (
                <tr key={record.cvId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{startIndex + index + 1}</td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
                    {record.profileOwnerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.organizationName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.positionTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{record.lastModifiedDate}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewCV(record.cvId)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-300 transition-colors"
                        title="View CV"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDownloadCV(record.cvId)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-300 transition-colors"
                        title="Download CV"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleShareCV(record.cvId)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded border border-blue-300 transition-colors"
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

        {historyRecords.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No resumes found.</p>
          </div>
        )}

        {/* Pagination */}
        {historyRecords.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(startIndex + pagination.limit, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                {pagination.page}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
