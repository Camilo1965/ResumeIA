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
      <div className="bg-gray-100 rounded-lg shadow-lg p-8 h-full flex items-center justify-center min-h-[600px]">
        <div className="text-center text-gray-400">
          <FileText size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-xl font-semibold mb-2">No Preview Available</p>
          <p className="text-sm">Generate a resume to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ maxHeight: '90vh' }}>
      {/* PDF Preview Controls Header */}
      <div className="bg-gray-100 border-b border-gray-300 px-4 py-2 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Page 1 / 1</span>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-2 py-1 hover:bg-gray-200 rounded" title="Zoom Out">-</button>
          <button className="px-2 py-1 hover:bg-gray-200 rounded" title="Zoom In">+</button>
          <button className="px-2 py-1 hover:bg-gray-200 rounded" title="Rotate">↻</button>
          <button className="px-2 py-1 hover:bg-gray-200 rounded" title="Download">⬇</button>
          <button className="px-2 py-1 hover:bg-gray-200 rounded" title="Print">🖨</button>
        </div>
      </div>

      {/* CV Content */}
      <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 50px)' }}>
        {/* Header */}
        <div className="text-center border-b-4 border-accent-gold pb-4 mb-6">
          <h1 className="text-3xl font-bold text-accent-teal mb-2">
            {cvContent.headerInfo.fullName}
          </h1>
          <p className="text-lg text-accent-teal font-semibold tracking-wide mb-3">
            {cvContent.headerInfo.professionalRole.toUpperCase()}
          </p>
          <p className="text-sm text-gray-700">
            {cvContent.headerInfo.locationText} | {cvContent.headerInfo.phoneNumber} | {cvContent.headerInfo.emailAddress}
            {cvContent.headerInfo.linkedinUrl && (
              <>
                <br />
                <a href={`https://${cvContent.headerInfo.linkedinUrl}`} className="text-accent-teal hover:underline">
                  {cvContent.headerInfo.linkedinUrl}
                </a>
              </>
            )}
          </p>
        </div>

      {/* Professional Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 border-accent-gold">
          SUMMARY
        </h2>
        <p 
          className="text-gray-700 leading-relaxed text-justify"
          dangerouslySetInnerHTML={{ 
            __html: cvContent.professionalOverview.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
          }}
        />
      </div>

      {/* Professional Experience */}
      {cvContent.workExperienceList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 border-accent-gold">
            PROFESSIONAL EXPERIENCE
          </h2>
          {cvContent.workExperienceList.map((experience, idx) => (
            <div key={idx} className="mb-5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-gray-900 text-lg">{experience.companyName}</h3>
                <span className="text-sm text-gray-600 italic">{experience.dateRange}</span>
              </div>
              <p className="text-accent-teal font-semibold mb-2">{experience.roleTitle}</p>
              <p 
                className="text-gray-700 mb-2"
                dangerouslySetInnerHTML={{ 
                  __html: experience.roleDescription.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                }}
              />
              <ul className="list-none space-y-1 mb-3">
                {experience.achievements.map((achievement, achIdx) => (
                  <li 
                    key={achIdx} 
                    className="text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-accent-teal before:font-bold"
                    dangerouslySetInnerHTML={{ 
                      __html: achievement.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                    }}
                  />
                ))}
              </ul>
              {experience.relevantTechnologies.length > 0 && (
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Skills:</span> {experience.relevantTechnologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {cvContent.educationList.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 border-accent-gold">
            EDUCATION
          </h2>
          {cvContent.educationList.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-gray-900">{edu.institutionName}</h3>
                <span className="text-sm text-gray-600 italic">{edu.dateRange}</span>
              </div>
              <p className="text-gray-700">{edu.degreeObtained}</p>
            </div>
          ))}
        </div>
      )}

      {/* Professional Skills */}
      {cvContent.skillCategories.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 pb-1 border-b-2 border-accent-gold">
            PROFESSIONAL SKILLS
          </h2>
          {cvContent.skillCategories.map((category, idx) => (
            <div key={idx} className="mb-3">
              <p className="text-gray-700">
                <span className="font-semibold">• {category.categoryName}:</span> {category.skillsList.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
