import { DefaultSession } from 'next-auth';

export type TemplateVariant = 'modern' | 'classic' | 'minimalist' | 'executive' | 'creative';

export type BackgroundPattern = 'none' | 'particle_dots' | 'dot_flow' | 'hexagon' | 'gradient_flow' | 'circuit_pattern' | 'waves';

export interface AuthenticatedUser {
  userId: string;
  fullName: string | null;
  emailAddress: string;
  verifiedEmail: Date | null;
  avatarImageUrl: string | null;
  hashedPassword: string | null;
  registeredAt: Date;
  lastModified: Date;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    userId?: string;
    email?: string;
    name?: string;
    picture?: string;
    provider?: string;
  }
}

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
  atsScore?: number;
  atsAnalysis?: string;
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

// ATS Analysis Types
export interface ATSAnalysisResult {
  overallScore: number;
  breakdown: {
    keywordMatch: ATSScoreDetail;
    formatScore: ATSScoreDetail;
    experienceRelevance: ATSScoreDetail;
    skillsMatch: ATSScoreDetail;
    education: ATSScoreDetail;
  };
  keywords: {
    found: string[];
    missing: string[];
    optional: string[];
  };
  recommendations: string[];
}

export interface ATSScoreDetail {
  score: number;
  max: number;
  details: string[];
}

export interface ATSAnalysisRequest {
  cvContent: CVContent;
  jobRequirements?: string;
}

