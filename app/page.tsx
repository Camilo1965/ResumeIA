'use client';

import { useState } from 'react';
import { CVBuilderForm } from '@/components/cv-builder/CVBuilderForm';
import { CVPreviewPanel } from '@/components/cv-builder/CVPreviewPanel';
import { CVContent } from '@/types';

export default function ResumeGeneratorPage() {
  const [cvContent, setCVContent] = useState<CVContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCV = async (formData: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userProfileId: 1, // TODO: Get from logged in user
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate CV');
      }

      const data = await response.json();
      setCVContent(data.cvContent);
    } catch (error) {
      console.error('Error generating CV:', error);
      alert('Failed to generate resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDownload = async () => {
    if (!cvContent) return;

    try {
      const response = await fetch('/api/resume/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cvContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create a blob from the response and download it
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Resume Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 card-shadow">
          <CVBuilderForm 
            onGenerateCV={handleGenerateCV} 
            isGenerating={isGenerating}
            onSaveDownload={handleSaveDownload}
            hasGeneratedCV={!!cvContent}
          />
        </div>

        {/* Preview Section */}
        <div>
          <CVPreviewPanel cvContent={cvContent} isLoading={isGenerating} />
        </div>
      </div>
    </div>
  );
}
