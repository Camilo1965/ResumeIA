'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Briefcase, Building2, Link2, FileText, Download, FileCheck } from 'lucide-react';
import { TemplateVariant, BackgroundPattern } from '@/types';

interface CVFormData {
  positionTitle: string;
  organizationName: string;
  jobPostingUrl?: string;
  displayLinkedin: boolean;
  positionDetails?: string;
  selectedTemplate: TemplateVariant;
  bgPattern: BackgroundPattern;
}

interface CVBuilderFormProps {
  onGenerateCV: (data: CVFormData) => Promise<void>;
  isGenerating: boolean;
  onSaveDownload?: () => void;
  hasGeneratedCV?: boolean;
}

export function CVBuilderForm({ onGenerateCV, isGenerating, onSaveDownload, hasGeneratedCV }: CVBuilderFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CVFormData>({
    defaultValues: {
      displayLinkedin: true,
      selectedTemplate: 'minimalist',
      bgPattern: 'hexagon',
    },
  });

  const [activeTemplate, setActiveTemplate] = useState<TemplateVariant>('minimalist');
  const [activeBackground, setActiveBackground] = useState<BackgroundPattern>('hexagon');
  const [profileName, setProfileName] = useState<string>('');

  useEffect(() => {
    // Fetch profile name (for now use mock data)
    // TODO: Replace with actual profile fetch when authentication is implemented
    setProfileName('John Doe');
  }, []);

  const onSubmitForm = async (formData: CVFormData) => {
    formData.selectedTemplate = activeTemplate;
    formData.bgPattern = activeBackground;
    await onGenerateCV(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Profile Header */}
      {profileName && (
        <div className="mb-6 pb-4 border-b-2 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            Profile: {profileName}
          </h2>
        </div>
      )}

      {/* Job Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Job Information</h3>
        
        {/* Job Title */}
      <div>
        <label className="label-text flex items-center space-x-2">
          <Briefcase size={16} />
          <span>Job Title *</span>
        </label>
        <input
          {...register('positionTitle', { required: 'Job title is required' })}
          className="input-field"
          placeholder="e.g., Senior Software Engineer"
        />
        {errors.positionTitle && (
          <p className="text-red-500 text-sm mt-1">{errors.positionTitle.message}</p>
        )}
      </div>

      {/* Company Name */}
      <div>
        <label className="label-text flex items-center space-x-2">
          <Building2 size={16} />
          <span>Company Name *</span>
        </label>
        <input
          {...register('organizationName', { required: 'Company name is required' })}
          className="input-field"
          placeholder="e.g., Tech Innovations Corp"
        />
        {errors.organizationName && (
          <p className="text-red-500 text-sm mt-1">{errors.organizationName.message}</p>
        )}
      </div>

      {/* Job Link */}
      <div>
        <label className="label-text flex items-center space-x-2">
          <Link2 size={16} />
          <span>Job Link (optional)</span>
        </label>
        <input
          {...register('jobPostingUrl')}
          className="input-field"
          placeholder="https://example.com/job-posting"
          type="url"
        />
      </div>

      {/* Show LinkedIn Checkbox */}
      <div className="flex items-center space-x-2">
        <input
          {...register('displayLinkedin')}
          type="checkbox"
          id="showLinkedin"
          className="w-4 h-4 text-primary-dark focus:ring-primary"
        />
        <label htmlFor="showLinkedin" className="text-sm font-medium text-gray-700">
          Show LinkedIn on resume
        </label>
      </div>

      {/* Job Requirements */}
      <div>
        <label className="label-text flex items-center space-x-2">
          <FileText size={16} />
          <span>Job Requirements (optional)</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">Share job requirements for AI to tailor your resume</p>
        <textarea
          {...register('positionDetails')}
          className="input-field"
          rows={6}
          placeholder="Paste the job description here to tailor your resume..."
        />
      </div>
      </div>

      {/* Resume Template Selector */}
      <div>
        <label className="label-text">Resume Template</label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {(['modern', 'classic', 'minimalist'] as TemplateVariant[]).map((template) => (
            <button
              key={template}
              type="button"
              onClick={() => setActiveTemplate(template)}
              className={`p-4 border-2 rounded-lg text-center capitalize transition-all ${
                activeTemplate === template
                  ? 'border-accent-teal bg-teal-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* Background Style Selector */}
      <div>
        <label className="label-text">Background Style</label>
        <div className="grid grid-cols-2 gap-4 mt-2">
          {([
            { value: 'none', label: 'No Background' },
            { value: 'particle_dots', label: 'Particle Dots' },
            { value: 'dot_flow', label: 'Dot Flow' },
            { value: 'hexagon', label: 'Hexagon' },
          ] as { value: BackgroundPattern; label: string }[]).map((bg) => (
            <button
              key={bg.value}
              type="button"
              onClick={() => setActiveBackground(bg.value)}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                activeBackground === bg.value
                  ? 'border-accent-teal bg-teal-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {bg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-400 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <FileCheck size={20} />
          <span>{isGenerating ? 'Generating...' : 'Generate Resume'}</span>
        </button>
        <button
          type="button"
          onClick={onSaveDownload}
          disabled={isGenerating || !hasGeneratedCV}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-accent-gold text-white font-semibold rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <Download size={20} />
          <span>Save & Download</span>
        </button>
      </div>
    </form>
  );
}
