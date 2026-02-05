'use client';

import { FileText } from 'lucide-react';
import { CVContent } from '@/types';

interface CVPreviewPanelProps {
  cvContent: CVContent | null;
  isLoading: boolean;
}

export function CVPreviewPanel({ cvContent, isLoading }: CVPreviewPanelProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Generating your resume...</p>
        </div>
      </div>
    );
  }

  if (!cvContent) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <FileText size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">Resume preview will appear here</p>
          <p className="text-sm mt-2">Fill in the form and click Generate Resume</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 overflow-y-auto" style={{ maxHeight: '90vh' }}>
      {/* Header */}
      <div className="text-center border-b-4 border-accent-teal pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {cvContent.headerInfo.fullName}
        </h1>
        <p className="text-lg text-accent-teal font-semibold mb-3">
          {cvContent.headerInfo.professionalRole.toUpperCase()}
        </p>
        <p className="text-sm text-gray-600">
          {cvContent.headerInfo.locationText} | {cvContent.headerInfo.phoneNumber} | {cvContent.headerInfo.emailAddress}
          {cvContent.headerInfo.linkedinUrl && ` | ${cvContent.headerInfo.linkedinUrl}`}
        </p>
      </div>

      {/* Professional Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
          PROFESSIONAL SUMMARY
        </h2>
        <p 
          className="text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: cvContent.professionalOverview.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
          }}
        />
      </div>

      {/* Professional Experience */}
      {cvContent.workExperienceList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          {cvContent.workExperienceList.map((experience, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900">{experience.companyName}</h3>
                <span className="text-sm text-gray-600">{experience.dateRange}</span>
              </div>
              <p className="text-accent-teal font-semibold mb-2">{experience.roleTitle}</p>
              <p className="text-gray-700 mb-2">{experience.roleDescription}</p>
              <ul className="list-disc list-inside space-y-1 mb-2">
                {experience.achievements.map((achievement, achIdx) => (
                  <li 
                    key={achIdx} 
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ 
                      __html: achievement.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }}
                  />
                ))}
              </ul>
              {experience.relevantTechnologies.length > 0 && (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Technologies:</span> {experience.relevantTechnologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {cvContent.educationList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
            EDUCATION
          </h2>
          {cvContent.educationList.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900">{edu.institutionName}</h3>
                <span className="text-sm text-gray-600">{edu.dateRange}</span>
              </div>
              <p className="text-gray-700">{edu.degreeObtained}</p>
            </div>
          ))}
        </div>
      )}

      {/* Professional Skills */}
      {cvContent.skillCategories.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-1">
            PROFESSIONAL SKILLS
          </h2>
          {cvContent.skillCategories.map((category, idx) => (
            <div key={idx} className="mb-3">
              <h3 className="font-semibold text-gray-900 mb-1">{category.categoryName}</h3>
              <p className="text-gray-700">{category.skillsList.join(' • ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
