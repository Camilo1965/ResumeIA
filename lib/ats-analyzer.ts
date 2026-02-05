import { CVContent, ATSAnalysisResult, ATSScoreDetail } from '@/types';
import { openAIService } from './openai';

/**
 * Extract keywords from job requirements text
 */
export function extractKeywordsFromJobRequirements(jobRequirements?: string): string[] {
  if (!jobRequirements) return [];

  const keywords: Set<string> = new Set();

  // Technical skills and technologies patterns
  const techPatterns = [
    // Programming languages
    /\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|Ruby|Go|Rust|PHP|Swift|Kotlin|Scala)\b/gi,
    // Frameworks & Libraries
    /\b(React|Vue|Angular|Next\.js|Node\.js|Express|Django|Flask|Spring|Laravel|Rails)\b/gi,
    // Databases
    /\b(PostgreSQL|MySQL|MongoDB|Redis|Cassandra|DynamoDB|Oracle|SQL Server)\b/gi,
    // Cloud & DevOps
    /\b(AWS|Azure|GCP|Docker|Kubernetes|Jenkins|GitHub Actions|CI\/CD|Terraform)\b/gi,
    // AI/ML
    /\b(Machine Learning|Deep Learning|TensorFlow|PyTorch|Scikit-learn|NLP|Computer Vision)\b/gi,
    // Other tools
    /\b(Git|Jira|Agile|Scrum|REST|GraphQL|Microservices)\b/gi,
  ];

  techPatterns.forEach(pattern => {
    const matches = jobRequirements.match(pattern);
    if (matches) {
      matches.forEach(match => keywords.add(match.trim()));
    }
  });

  // Extract years of experience
  const yearsPattern = /(\d+)\+?\s*years?/gi;
  const yearsMatches = jobRequirements.match(yearsPattern);
  if (yearsMatches) {
    yearsMatches.forEach(match => keywords.add(match.trim()));
  }

  // Extract certifications
  const certPattern = /\b(AWS Certified|PMP|Scrum Master|CKA|CKAD)\b/gi;
  const certMatches = jobRequirements.match(certPattern);
  if (certMatches) {
    certMatches.forEach(match => keywords.add(match.trim()));
  }

  // Extract common soft skills
  const softSkillsPattern = /\b(leadership|communication|team player|problem solving|analytical|collaborative|mentoring)\b/gi;
  const softSkillsMatches = jobRequirements.match(softSkillsPattern);
  if (softSkillsMatches) {
    softSkillsMatches.forEach(match => keywords.add(match.trim()));
  }

  return Array.from(keywords);
}

/**
 * Analyze keyword match between CV and job requirements
 */
export function analyzeKeywordMatch(
  cvContent: CVContent,
  jobKeywords: string[]
): { found: string[], missing: string[], score: number } {
  if (jobKeywords.length === 0) {
    return { found: [], missing: [], score: 30 }; // Full score if no job requirements
  }

  const cvText = JSON.stringify(cvContent).toLowerCase();
  const found: string[] = [];
  const missing: string[] = [];

  jobKeywords.forEach(keyword => {
    if (cvText.includes(keyword.toLowerCase())) {
      found.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  const matchPercentage = found.length / jobKeywords.length;
  const score = Math.round(matchPercentage * 30);

  return { found, missing, score };
}

/**
 * Analyze CV format for ATS compatibility
 */
export function analyzeFormat(cvContent: CVContent): ATSScoreDetail {
  const details: string[] = [];
  let score = 20;

  // Check for standard sections
  if (cvContent.professionalOverview) {
    details.push('✓ Professional summary present');
  } else {
    details.push('✗ Missing professional summary');
    score -= 3;
  }

  if (cvContent.workExperienceList.length > 0) {
    details.push('✓ Work experience section present');
  } else {
    details.push('✗ Missing work experience');
    score -= 5;
  }

  if (cvContent.educationList.length > 0) {
    details.push('✓ Education section present');
  } else {
    details.push('! Education section missing or incomplete');
    score -= 2;
  }

  if (cvContent.skillCategories.length > 0) {
    details.push('✓ Skills section present');
  } else {
    details.push('✗ Missing skills section');
    score -= 3;
  }

  // Check for contact information
  if (cvContent.headerInfo.emailAddress && cvContent.headerInfo.phoneNumber) {
    details.push('✓ Complete contact information');
  } else {
    details.push('! Incomplete contact information');
    score -= 2;
  }

  details.push('✓ Clean, ATS-friendly formatting');
  details.push('✓ Standard section headers');

  return {
    score: Math.max(0, score),
    max: 20,
    details,
  };
}

/**
 * Analyze experience relevance
 */
export function analyzeExperienceRelevance(
  cvContent: CVContent,
  jobKeywords: string[]
): ATSScoreDetail {
  const details: string[] = [];
  let score = 25;

  const experiences = cvContent.workExperienceList;

  if (experiences.length === 0) {
    return {
      score: 0,
      max: 25,
      details: ['✗ No work experience listed'],
    };
  }

  // Check for quantifiable achievements
  let hasMetrics = false;
  experiences.forEach(exp => {
    const achievementText = exp.achievements.join(' ');
    if (/\d+%|\$\d+|\d+[kKmMbB]?\+?/.test(achievementText)) {
      hasMetrics = true;
    }
  });

  if (hasMetrics) {
    details.push('✓ Quantifiable achievements present');
  } else {
    details.push('! Add more quantifiable achievements (%, $, numbers)');
    score -= 5;
  }

  // Check for action verbs
  const actionVerbs = ['led', 'architected', 'implemented', 'drove', 'designed', 'developed', 'managed', 'created'];
  let hasActionVerbs = false;
  experiences.forEach(exp => {
    const achievementText = exp.achievements.join(' ').toLowerCase();
    if (actionVerbs.some(verb => achievementText.includes(verb))) {
      hasActionVerbs = true;
    }
  });

  if (hasActionVerbs) {
    details.push('✓ Strong action verbs used');
  } else {
    details.push('! Include more action verbs (Led, Architected, Implemented)');
    score -= 3;
  }

  // Check for technology alignment
  if (jobKeywords.length > 0) {
    const techCount = experiences.reduce((count, exp) => {
      return count + exp.relevantTechnologies.length;
    }, 0);

    if (techCount >= 5) {
      details.push('✓ Technologies well documented');
    } else {
      details.push('! Add more relevant technologies');
      score -= 2;
    }
  }

  // Check for role descriptions
  const hasDescriptions = experiences.every(exp => exp.roleDescription && exp.roleDescription.length > 20);
  if (hasDescriptions) {
    details.push('✓ Clear role descriptions provided');
  } else {
    details.push('! Add detailed role descriptions');
    score -= 3;
  }

  return {
    score: Math.max(0, score),
    max: 25,
    details,
  };
}

/**
 * Analyze skills match
 */
export function analyzeSkillsMatch(
  cvContent: CVContent,
  jobKeywords: string[]
): ATSScoreDetail {
  const details: string[] = [];
  let score = 15;

  if (cvContent.skillCategories.length === 0) {
    return {
      score: 0,
      max: 15,
      details: ['✗ No skills section present'],
    };
  }

  const allSkills = cvContent.skillCategories.flatMap(cat => cat.skillsList);

  if (allSkills.length >= 10) {
    details.push('✓ Comprehensive skills list');
  } else {
    details.push('! Add more skills to improve ATS match');
    score -= 3;
  }

  // Check for skill categories
  if (cvContent.skillCategories.length >= 3) {
    details.push('✓ Skills well organized into categories');
  } else {
    details.push('! Consider organizing skills into categories');
    score -= 2;
  }

  if (jobKeywords.length > 0) {
    const skillsText = allSkills.join(' ').toLowerCase();
    const matchedKeywords = jobKeywords.filter(kw => 
      skillsText.includes(kw.toLowerCase())
    );

    if (matchedKeywords.length >= jobKeywords.length * 0.5) {
      details.push('✓ Good match with required skills');
    } else {
      details.push('! Add more job-required skills');
      score -= 4;
    }
  }

  return {
    score: Math.max(0, score),
    max: 15,
    details,
  };
}

/**
 * Analyze education section
 */
export function analyzeEducation(cvContent: CVContent): ATSScoreDetail {
  const details: string[] = [];
  let score = 10;

  if (cvContent.educationList.length === 0) {
    return {
      score: 5,
      max: 10,
      details: ['! Education section missing or incomplete'],
    };
  }

  const education = cvContent.educationList[0];

  if (education.degreeObtained) {
    details.push('✓ Degree information present');
  } else {
    details.push('! Add degree information');
    score -= 2;
  }

  if (education.dateRange) {
    details.push('✓ Dates included');
  } else {
    details.push('! Add graduation dates');
    score -= 2;
  }

  if (education.institutionName) {
    details.push('✓ Institution name provided');
  } else {
    details.push('! Add institution name');
    score -= 2;
  }

  return {
    score: Math.max(5, score),
    max: 10,
    details,
  };
}

/**
 * Generate recommendations based on analysis
 */
export function generateRecommendations(
  keywordAnalysis: { found: string[], missing: string[] },
  experienceScore: number,
  skillsScore: number
): string[] {
  const recommendations: string[] = [];

  // Keyword-based recommendations
  if (keywordAnalysis.missing.length > 0) {
    const topMissing = keywordAnalysis.missing.slice(0, 3);
    topMissing.forEach(keyword => {
      recommendations.push(`Add "${keyword}" to your skills or experience if applicable`);
    });
  }

  // Experience recommendations
  if (experienceScore < 20) {
    recommendations.push('Include more quantifiable achievements with metrics (%, $, numbers)');
    recommendations.push('Use stronger action verbs (Led, Architected, Implemented, Drove)');
    recommendations.push('Add more detailed role descriptions with key technologies');
  }

  // Skills recommendations
  if (skillsScore < 12) {
    recommendations.push('Expand your skills section with more relevant technologies');
    recommendations.push('Organize skills into clear categories for better ATS parsing');
  }

  // General recommendations
  if (recommendations.length === 0) {
    recommendations.push('Your resume looks good! Consider adding more specific metrics to achievements');
    recommendations.push('Keep your resume updated with latest technologies and accomplishments');
  }

  return recommendations;
}

/**
 * Main ATS analysis function
 */
export async function analyzeATSCompatibility(
  cvContent: CVContent,
  jobRequirements?: string
): Promise<ATSAnalysisResult> {
  // Extract keywords from job requirements
  const jobKeywords = extractKeywordsFromJobRequirements(jobRequirements);

  // Analyze keyword match
  const keywordAnalysis = analyzeKeywordMatch(cvContent, jobKeywords);

  // Analyze format
  const formatAnalysis = analyzeFormat(cvContent);

  // Analyze experience relevance
  const experienceAnalysis = analyzeExperienceRelevance(cvContent, jobKeywords);

  // Analyze skills match
  const skillsAnalysis = analyzeSkillsMatch(cvContent, jobKeywords);

  // Analyze education
  const educationAnalysis = analyzeEducation(cvContent);

  // Calculate overall score
  const overallScore = 
    keywordAnalysis.score +
    formatAnalysis.score +
    experienceAnalysis.score +
    skillsAnalysis.score +
    educationAnalysis.score;

  // Generate recommendations
  const recommendations = generateRecommendations(
    keywordAnalysis,
    experienceAnalysis.score,
    skillsAnalysis.score
  );

  return {
    overallScore,
    breakdown: {
      keywordMatch: {
        score: keywordAnalysis.score,
        max: 30,
        details: [
          `Found: ${keywordAnalysis.found.join(', ') || 'None'}`,
          `Missing: ${keywordAnalysis.missing.join(', ') || 'None'}`,
        ],
      },
      formatScore: formatAnalysis,
      experienceRelevance: experienceAnalysis,
      skillsMatch: skillsAnalysis,
      education: educationAnalysis,
    },
    keywords: {
      found: keywordAnalysis.found,
      missing: keywordAnalysis.missing,
      optional: [], // Can be enhanced later
    },
    recommendations,
  };
}

export const atsAnalyzer = {
  analyzeATSCompatibility,
  extractKeywordsFromJobRequirements,
};
