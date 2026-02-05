export type TemplateVariant = 'modern' | 'classic' | 'minimalist';

export type BackgroundPattern = 'none' | 'particle_dots' | 'dot_flow' | 'hexagon';

export interface ProfileData {
  profileId?: number;
  completeName: string;
  jobTitle?: string;
  contactPhone: string;
  contactEmail: string;
  cityLocation: string;
  linkedinProfile?: string;
  displayLinkedin: boolean;
  jobHistory?: string;
  academicHistory?: string;
  technicalSkills?: string;
  selectedTemplate: TemplateVariant;
  bgPattern: BackgroundPattern;
}

export interface CVGenerationRequest {
  userProfileId: number;
  positionTitle: string;
  organizationName: string;
  jobPostingUrl?: string;
  positionDetails?: string;
  displayLinkedin?: boolean;
}

export interface GeneratedCVData {
  cvId?: number;
  userProfileId: number;
  positionTitle: string;
  organizationName: string;
  jobPostingUrl?: string;
  positionDetails?: string;
  aiGeneratedText: string;
  pdfFileUrl?: string;
  cvCreatedAt?: Date;
  cvUpdatedAt?: Date;
}

export interface CVContent {
  headerInfo: {
    fullName: string;
    professionalRole: string;
    locationText: string;
    phoneNumber: string;
    emailAddress: string;
    linkedinUrl?: string;
  };
  professionalOverview: string;
  workExperienceList: WorkExperienceEntry[];
  educationList: EducationEntry[];
  skillCategories: SkillCategory[];
}

export interface WorkExperienceEntry {
  companyName: string;
  dateRange: string;
  roleTitle: string;
  roleDescription: string;
  achievements: string[];
  relevantTechnologies: string[];
}

export interface EducationEntry {
  institutionName: string;
  dateRange: string;
  degreeObtained: string;
}

export interface SkillCategory {
  categoryName: string;
  skillsList: string[];
}
