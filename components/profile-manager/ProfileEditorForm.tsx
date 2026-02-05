'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Briefcase, Phone, Mail, MapPin, Linkedin, GraduationCap, Code } from 'lucide-react';
import { TemplateVariant, BackgroundPattern } from '@/types';

interface ProfileFormInputs {
  completeName: string;
  jobTitle: string;
  contactPhone: string;
  contactEmail: string;
  cityLocation: string;
  linkedinProfile?: string;
  displayLinkedin: boolean;
  jobHistory?: string;
  academicHistory?: string;
  technicalSkills?: string;
}

interface ProfileEditorProps {
  existingProfileData?: any;
  onSaveProfile: (data: any) => Promise<void>;
}

export function ProfileEditorForm({ existingProfileData, onSaveProfile }: ProfileEditorProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormInputs>({
    defaultValues: existingProfileData || {
      displayLinkedin: true,
    },
  });

  const [chosenTemplate, setChosenTemplate] = useState<TemplateVariant>(
    existingProfileData?.selectedTemplate || 'minimalist'
  );
  const [chosenBackground, setChosenBackground] = useState<BackgroundPattern>(
    existingProfileData?.bgPattern || 'hexagon'
  );
  const [savingInProgress, setSavingInProgress] = useState(false);

  const submitProfileData = async (formInputs: ProfileFormInputs) => {
    setSavingInProgress(true);
    try {
      await onSaveProfile({
        ...formInputs,
        selectedTemplate: chosenTemplate,
        bgPattern: chosenBackground,
      });
    } finally {
      setSavingInProgress(false);
    }
  };

  const templateOptions: TemplateVariant[] = ['modern', 'classic', 'minimalist'];
  const backgroundOptions = [
    { id: 'none', displayName: 'No Background' },
    { id: 'particle_dots', displayName: 'Particle Dots' },
    { id: 'dot_flow', displayName: 'Dot Flow' },
    { id: 'hexagon', displayName: 'Hexagon' },
  ];

  return (
    <form onSubmit={handleSubmit(submitProfileData)} className="space-y-6">
      {/* Full Name */}
      <div>
        <label className="label-text flex items-center space-x-2">
          <User size={16} />
          <span>Full Name *</span>
        </label>
        <input
          {...register('completeName', { required: 'Full name is required' })}
          className="input-field"
          placeholder="Enter your complete name"
        />
        {errors.completeName && (
          <p className="text-red-500 text-sm mt-1">{errors.completeName.message}</p>
        )}
      </div>

      {/* Professional Title */}
      <div>
        <label className="label-text flex items-center space-x-2">
          <Briefcase size={16} />
          <span>Professional Title</span>
        </label>
        <input
          {...register('jobTitle')}
          className="input-field"
          placeholder="e.g., Senior Software Engineer"
        />
      </div>

      {/* Contact Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label-text flex items-center space-x-2">
            <Phone size={16} />
            <span>Phone *</span>
          </label>
          <input
            {...register('contactPhone', { required: 'Phone is required' })}
            className="input-field"
            placeholder="+1 (555) 123-4567"
          />
          {errors.contactPhone && (
            <p className="text-red-500 text-sm mt-1">{errors.contactPhone.message}</p>
          )}
        </div>

        <div>
          <label className="label-text flex items-center space-x-2">
            <Mail size={16} />
            <span>Email *</span>
          </label>
          <input
            {...register('contactEmail', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="input-field"
            placeholder="your.email@example.com"
            type="email"
          />
          {errors.contactEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="label-text flex items-center space-x-2">
          <MapPin size={16} />
          <span>Location *</span>
        </label>
        <input
          {...register('cityLocation', { required: 'Location is required' })}
          className="input-field"
          placeholder="City, State/Country"
        />
        {errors.cityLocation && (
          <p className="text-red-500 text-sm mt-1">{errors.cityLocation.message}</p>
        )}
      </div>

      {/* LinkedIn */}
      <div>
        <label className="label-text flex items-center space-x-2">
          <Linkedin size={16} />
          <span>LinkedIn Profile (optional)</span>
        </label>
        <input
          {...register('linkedinProfile')}
          className="input-field"
          placeholder="linkedin.com/in/yourprofile"
        />
      </div>

      {/* Show LinkedIn Toggle */}
      <div className="flex items-center space-x-2">
        <input
          {...register('displayLinkedin')}
          type="checkbox"
          id="linkedinDisplay"
          className="w-4 h-4 text-primary-dark focus:ring-primary"
        />
        <label htmlFor="linkedinDisplay" className="text-sm font-medium text-gray-700">
          Display LinkedIn URL on generated resumes
        </label>
      </div>

      {/* Work Experience */}
      <div>
        <label className="label-text flex items-center space-x-2">
          <Briefcase size={16} />
          <span>Work Experience</span>
        </label>
        <textarea
          {...register('jobHistory')}
          className="input-field"
          rows={5}
          placeholder="Describe your work history, one job per line or paragraph..."
        />
      </div>

      {/* Education */}
      <div>
        <label className="label-text flex items-center space-x-2">
          <GraduationCap size={16} />
          <span>Education</span>
        </label>
        <textarea
          {...register('academicHistory')}
          className="input-field"
          rows={3}
          placeholder="Your educational background..."
        />
      </div>

      {/* Technical Skills */}
      <div>
        <label className="label-text flex items-center space-x-2">
          <Code size={16} />
          <span>Technical Skills</span>
        </label>
        <textarea
          {...register('technicalSkills')}
          className="input-field"
          rows={3}
          placeholder="List your technical skills, separated by commas..."
        />
      </div>

      {/* Template Selector */}
      <div>
        <label className="label-text">Resume Template Style</label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {templateOptions.map((templateOption) => (
            <div
              key={templateOption}
              onClick={() => setChosenTemplate(templateOption)}
              className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-all ${
                chosenTemplate === templateOption
                  ? 'border-accent-teal bg-teal-50 shadow-md'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-2"></div>
              <p className="text-sm font-medium capitalize">{templateOption}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Background Pattern Selector */}
      <div>
        <label className="label-text">Resume Background</label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {backgroundOptions.map((bgOption) => (
            <div
              key={bgOption.id}
              onClick={() => setChosenBackground(bgOption.id as BackgroundPattern)}
              className={`cursor-pointer p-4 border-2 rounded-lg text-center transition-all ${
                chosenBackground === bgOption.id
                  ? 'border-accent-teal bg-teal-50 shadow-md'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="h-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded mb-2"></div>
              <p className="text-sm font-medium">{bgOption.displayName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={savingInProgress}
          className="btn-primary w-full disabled:opacity-50"
        >
          {savingInProgress ? 'Saving Profile...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
