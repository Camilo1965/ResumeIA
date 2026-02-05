'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Briefcase, Building2, Link2, FileText } from 'lucide-react';
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
}

export function CVBuilderForm({ onGenerateCV, isGenerating }: CVBuilderFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CVFormData>({
    defaultValues: {
      displayLinkedin: true,
      selectedTemplate: 'minimalist',
      bgPattern: 'hexagon',
    },
  });

  const [activeTemplate, setActiveTemplate] = useState<TemplateVariant>('minimalist');
  const [activeBackground, setActiveBackground] = useState<BackgroundPattern>('hexagon');

  const onSubmitForm = async (formData: CVFormData) => {
    formData.selectedTemplate = activeTemplate;
    formData.bgPattern = activeBackground;
    await onGenerateCV(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
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
        <textarea
          {...register('positionDetails')}
          className="input-field"
          rows={6}
          placeholder="Paste the job description here to tailor your resume..."
        />
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
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={isGenerating}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : 'Generate Resume'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          disabled={isGenerating}
        >
          Save & Download
        </button>
      </div>
    </form>
  );
}
