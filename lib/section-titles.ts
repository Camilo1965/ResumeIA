// Section title translations for PDF templates
export const sectionTitles = {
  en: {
    summary: 'PROFESSIONAL SUMMARY',
    experience: 'PROFESSIONAL EXPERIENCE',
    education: 'EDUCATION',
    skills: 'PROFESSIONAL SKILLS',
    // Minimalist style (shorter)
    summaryShort: 'SUMMARY',
    experienceShort: 'EXPERIENCE',
    educationShort: 'EDUCATION',
    skillsShort: 'SKILLS',
    // Executive style
    executiveSummary: 'EXECUTIVE SUMMARY',
    keyAchievements: 'KEY ACHIEVEMENTS',
    // Creative style
    contact: 'CONTACT',
    aboutMe: 'ABOUT ME',
  },
  es: {
    summary: 'RESUMEN PROFESIONAL',
    experience: 'EXPERIENCIA PROFESIONAL',
    education: 'EDUCACIÓN',
    skills: 'HABILIDADES PROFESIONALES',
    // Minimalist style (shorter)
    summaryShort: 'RESUMEN',
    experienceShort: 'EXPERIENCIA',
    educationShort: 'EDUCACIÓN',
    skillsShort: 'HABILIDADES',
    // Executive style
    executiveSummary: 'RESUMEN EJECUTIVO',
    keyAchievements: 'LOGROS CLAVE',
    // Creative style
    contact: 'CONTACTO',
    aboutMe: 'SOBRE MÍ',
  },
};

export function getSectionTitles(language: 'en' | 'es' = 'en', style: 'full' | 'short' = 'full') {
  const titles = sectionTitles[language];
  if (style === 'short') {
    return {
      summary: titles.summaryShort,
      experience: titles.experienceShort,
      education: titles.educationShort,
      skills: titles.skillsShort,
      contact: titles.contact,
      aboutMe: titles.aboutMe,
    };
  }
  return {
    summary: titles.summary,
    experience: titles.experience,
    education: titles.education,
    skills: titles.skills,
    executiveSummary: titles.executiveSummary,
    keyAchievements: titles.keyAchievements,
    contact: titles.contact,
    aboutMe: titles.aboutMe,
  };
}
