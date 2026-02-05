'use client';

import { useState } from 'react';
import { Linkedin, X, Upload, Link as LinkIcon } from 'lucide-react';

interface LinkedInImportButtonProps {
  onImport: (data: LinkedInImportedData) => void;
}

export interface LinkedInImportedData {
  fullName?: string;
  professionalTitle?: string;
  location?: string;
  linkedinUrl?: string;
  workExperience?: string;
  education?: string;
  skills?: string[];
}

export function LinkedInImportButton({ onImport }: LinkedInImportButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [manualData, setManualData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [importMethod, setImportMethod] = useState<'url' | 'manual'>('manual');

  const handleImport = async () => {
    setError('');
    setLoading(true);

    try {
      const requestBody = importMethod === 'url' 
        ? { linkedinUrl } 
        : { manualData };

      const response = await fetch('/api/linkedin/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to import data');
      }

      if (result.data) {
        onImport(result.data);
        setShowModal(false);
        resetForm();
      } else {
        throw new Error('No data received from import');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLinkedinUrl('');
    setManualData('');
    setError('');
    setImportMethod('manual');
  };

  const handleClose = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
      >
        <Linkedin size={18} />
        <span>Import from LinkedIn</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Linkedin className="text-blue-600" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Import from LinkedIn</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Method Selection */}
              <div className="flex space-x-4 border-b border-gray-200">
                <button
                  type="button"
                  onClick={() => setImportMethod('manual')}
                  className={`pb-3 px-2 font-medium transition-colors relative ${
                    importMethod === 'manual'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Upload size={16} className="inline mr-2" />
                  Manual Paste
                </button>
                <button
                  type="button"
                  onClick={() => setImportMethod('url')}
                  className={`pb-3 px-2 font-medium transition-colors relative ${
                    importMethod === 'url'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <LinkIcon size={16} className="inline mr-2" />
                  LinkedIn URL
                </button>
              </div>

              {/* Manual Data Input */}
              {importMethod === 'manual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste your LinkedIn profile data:
                  </label>
                  <p className="text-sm text-gray-600 mb-3">
                    Copy and paste your LinkedIn profile information. Include sections like:
                    Name, Title, Location, Experience, Education, and Skills.
                  </p>
                  <textarea
                    value={manualData}
                    onChange={(e) => setManualData(e.target.value)}
                    className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder={`Example format:

Name: John Doe
Headline: Senior Software Engineer at TechCorp
Location: San Francisco, CA

Experience:
Senior Software Engineer
TechCorp
2020 - Present
• Led development of cloud-native applications
• Managed team of 5 engineers

Education:
Stanford University
BS Computer Science
2016 - 2020

Skills: JavaScript, React, Node.js, Python, AWS`}
                  />
                </div>
              )}

              {/* URL Input */}
              {importMethod === 'url' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste your LinkedIn profile URL:
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Note: Due to LinkedIn restrictions, only the profile URL will be saved.
                    For complete data import, please use the "Manual Paste" method.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={loading || (importMethod === 'url' && !linkedinUrl) || (importMethod === 'manual' && !manualData)}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Importing...' : 'Import Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
