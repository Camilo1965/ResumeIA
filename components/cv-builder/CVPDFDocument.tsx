import React from 'react';
import { CVContent, TemplateVariant } from '@/types';
import { ModernTemplate } from '../resume/templates/ModernTemplate';
import { ClassicTemplate } from '../resume/templates/ClassicTemplate';
import { MinimalistTemplate } from '../resume/templates/MinimalistTemplate';
import { ExecutiveTemplate } from '../resume/templates/ExecutiveTemplate';
import { CreativeTemplate } from '../resume/templates/CreativeTemplate';

interface CVPDFDocumentProps {
  cvContent: CVContent;
  template?: TemplateVariant;
  cvLanguage?: 'en' | 'es';
}

// Export the Document component directly
export const CVPDFDocument = ({ cvContent, template = 'modern', cvLanguage = 'en' }: CVPDFDocumentProps) => {
  switch (template) {
    case 'classic':
      return <ClassicTemplate cvContent={cvContent} cvLanguage={cvLanguage} />;
    case 'minimalist':
      return <MinimalistTemplate cvContent={cvContent} cvLanguage={cvLanguage} />;
    case 'executive':
      return <ExecutiveTemplate cvContent={cvContent} cvLanguage={cvLanguage} />;
    case 'creative':
      return <CreativeTemplate cvContent={cvContent} cvLanguage={cvLanguage} />;
    case 'modern':
    default:
      return <ModernTemplate cvContent={cvContent} cvLanguage={cvLanguage} />;
  }
};

