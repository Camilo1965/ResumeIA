import OpenAI from 'openai';
import { CVContent, ProfileData } from '@/types';

const aiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

export async function generateCVContentWithAI(
  profileInfo: ProfileData,
  positionTitle: string,
  organizationName: string,
  positionDetails?: string
): Promise<CVContent> {
  // Fallback mock data when API key is not configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
    return createMockCVContent(profileInfo, positionTitle, organizationName);
  }

  try {
    const promptText = buildPromptForCVGeneration(
      profileInfo,
      positionTitle,
      organizationName,
      positionDetails
    );

    const completion = await aiClient.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are an expert resume writer specializing in creating ATS-friendly resumes. You:
- Highlight relevant experience for target positions
- Use strong action verbs and quantifiable achievements
- Incorporate keywords from job requirements naturally
- Create compelling, metric-driven content
- Format responses as valid JSON only, no markdown or code blocks`,
        },
        {
          role: 'user',
          content: promptText,
        },
      ],
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from AI');
    }

    return parseCVContentFromAI(responseText, profileInfo);
  } catch (error) {
    console.error('AI generation error:', error);
    return createMockCVContent(profileInfo, positionTitle, organizationName);
  }
}

function buildPromptForCVGeneration(
  profileInfo: ProfileData,
  positionTitle: string,
  organizationName: string,
  positionDetails?: string
): string {
  return `You are an expert resume writer. Create a professional, ATS-friendly resume tailored to the target position.

TARGET POSITION: ${positionTitle} at ${organizationName}
${positionDetails ? `\nJOB REQUIREMENTS:\n${positionDetails}\n` : ''}

CANDIDATE INFORMATION:
- Name: ${profileInfo.completeName}
- Current Title: ${profileInfo.jobTitle || 'Software Engineer'}
- Location: ${profileInfo.cityLocation}
- Phone: ${profileInfo.contactPhone}
- Email: ${profileInfo.contactEmail}
${profileInfo.linkedinProfile ? `- LinkedIn: ${profileInfo.linkedinProfile}` : ''}

WORK HISTORY:
${profileInfo.jobHistory || 'No work history provided'}

EDUCATION:
${profileInfo.academicHistory || 'No education history provided'}

TECHNICAL SKILLS:
${profileInfo.technicalSkills || 'No technical skills provided'}

INSTRUCTIONS:
1. Create a compelling PROFESSIONAL SUMMARY (3-4 sentences) that:
   - Highlights years of experience and key expertise
   - Uses keywords from job requirements
   - Emphasizes quantifiable achievements
   - Aligns with the target position
   - Use **bold** for important technologies and metrics

2. For PROFESSIONAL EXPERIENCE, provide 5-8 bullet points per role that:
   - Start with strong action verbs (Led, Architected, Implemented, Drove, etc.)
   - Include quantifiable metrics (percentages, numbers, scale)
   - Highlight relevant technologies in **bold**
   - Focus on impact and results
   - Tailor achievements to match job requirements

3. For SKILLS, organize into these categories:
   - Programming & Development
   - AI & Machine Learning (if applicable)
   - Documentation & Quality Assurance
   - Team Collaboration & Stakeholder Engagement

4. Include a brief role description (1-2 lines) for each work experience before the bullet points

RESPOND WITH ONLY VALID JSON in this exact structure:
{
  "professionalOverview": "3-4 sentence summary with **bold keywords**",
  "workExperienceList": [
    {
      "companyName": "Company Name",
      "dateRange": "Month Year - Month Year (or Present)",
      "roleTitle": "Job Title",
      "roleDescription": "Brief 1-2 line description of the role with **key technologies**",
      "achievements": [
        "Action verb + achievement with **25%** metric and **technology**",
        "Another achievement with quantifiable impact",
        "Achievement showing collaboration or leadership",
        "Achievement demonstrating technical expertise",
        "Achievement aligned with job requirements"
      ],
      "relevantTechnologies": ["Tech1", "Tech2", "Tech3", "Tech4"]
    }
  ],
  "educationList": [
    {
      "institutionName": "University Name",
      "dateRange": "Year - Year",
      "degreeObtained": "Degree Title (e.g., B.S. in Computer Science)"
    }
  ],
  "skillCategories": [
    {
      "categoryName": "Programming & Development",
      "skillsList": ["JavaScript", "TypeScript", "Python", "React", "Node.js"]
    },
    {
      "categoryName": "AI & Machine Learning",
      "skillsList": ["TensorFlow", "PyTorch", "OpenAI API", "LangChain"]
    },
    {
      "categoryName": "Documentation & Quality Assurance",
      "skillsList": ["Jest", "Pytest", "Git", "CI/CD", "Agile"]
    },
    {
      "categoryName": "Team Collaboration & Stakeholder Engagement",
      "skillsList": ["Technical Leadership", "Code Review", "Mentoring", "Cross-functional Collaboration"]
    }
  ]
}`;
}

function parseCVContentFromAI(aiResponse: string, profileInfo: ProfileData): CVContent {
  try {
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return {
      headerInfo: {
        fullName: profileInfo.completeName,
        professionalRole: profileInfo.jobTitle || 'Software Engineer',
        locationText: profileInfo.cityLocation,
        phoneNumber: profileInfo.contactPhone,
        emailAddress: profileInfo.contactEmail,
        linkedinUrl: profileInfo.linkedinProfile,
      },
      professionalOverview: parsedData.professionalOverview || 'Professional overview',
      workExperienceList: parsedData.workExperienceList || [],
      educationList: parsedData.educationList || [],
      skillCategories: parsedData.skillCategories || [],
    };
  } catch (error) {
    console.error('Parsing error:', error);
    return createMockCVContent(profileInfo, '', '');
  }
}

function createMockCVContent(
  profileInfo: ProfileData,
  positionTitle: string,
  organizationName: string
): CVContent {
  return {
    headerInfo: {
      fullName: profileInfo.completeName,
      professionalRole: positionTitle || profileInfo.jobTitle || 'Senior Software Engineer',
      locationText: profileInfo.cityLocation,
      phoneNumber: profileInfo.contactPhone,
      emailAddress: profileInfo.contactEmail,
      linkedinUrl: profileInfo.linkedinProfile,
    },
    professionalOverview: `Results-driven software engineer with **8+ years** of experience specializing in **full-stack development** and **AI/ML solutions**. Proven track record of architecting **scalable microservices** that serve **millions of users** and implementing **machine learning models** that increased efficiency by **30%**. Skilled in **React**, **Node.js**, **Python**, and **cloud technologies**. Passionate about delivering high-impact solutions and mentoring engineering teams.`,
    workExperienceList: [
      {
        companyName: 'Tech Innovations Corp',
        dateRange: 'January 2020 - Present',
        roleTitle: 'Senior Software Engineer',
        roleDescription: 'Leading development of AI-powered enterprise applications using **React**, **Node.js**, and **Python**, while mentoring a team of 6 engineers and driving architectural decisions.',
        achievements: [
          'Architected and deployed **microservices infrastructure** on **AWS**, reducing deployment time by **40%** and improving system reliability to **99.9% uptime**',
          'Implemented **machine learning recommendation system** using **TensorFlow** that improved user engagement by **25%** and drove **$2M in additional revenue**',
          'Led team of **6 developers** in migrating legacy monolith to modern architecture, delivering **15% ahead of schedule** with zero production incidents',
          'Established **CI/CD pipelines** and **automated testing** frameworks, decreasing bugs in production by **35%** and accelerating release cycles',
          'Championed code quality initiatives including comprehensive code reviews and best practices documentation, improving team velocity by **20%**',
          'Collaborated with product and design teams to deliver **5 major features** that increased customer satisfaction scores by **18%**',
        ],
        relevantTechnologies: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'TensorFlow', 'Docker', 'Kubernetes'],
      },
      {
        companyName: 'Digital Solutions Ltd',
        dateRange: 'March 2018 - December 2019',
        roleTitle: 'Full Stack Developer',
        roleDescription: 'Developed and maintained enterprise web applications and **RESTful APIs** serving **50,000+ active users**, utilizing **React**, **Node.js**, and **PostgreSQL**.',
        achievements: [
          'Built customer portal from scratch using **React** and **Node.js**, serving **50,000+ users** with **99.9% uptime** and **sub-200ms response times**',
          'Optimized database queries and implemented caching strategies, reducing API response time by **30%** and database load by **40%**',
          'Implemented comprehensive **CI/CD pipeline** using **Jenkins** and **Docker**, decreasing deployment time from hours to **15 minutes**',
          'Developed **automated testing suite** with **90% code coverage**, reducing production bugs by **20%** and improving code maintainability',
          'Collaborated with **cross-functional teams** to gather requirements and deliver solutions that met **100% of acceptance criteria**',
        ],
        relevantTechnologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Jenkins', 'Git'],
      },
    ],
    educationList: [
      {
        institutionName: 'Technical University',
        dateRange: '2014 - 2018',
        degreeObtained: 'B.S. in Computer Science',
      },
    ],
    skillCategories: [
      {
        categoryName: 'Programming & Development',
        skillsList: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Next.js', 'Node.js', 'Express', 'Django'],
      },
      {
        categoryName: 'AI & Machine Learning',
        skillsList: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI API', 'LangChain', 'Neural Networks', 'NLP'],
      },
      {
        categoryName: 'Documentation & Quality Assurance',
        skillsList: ['Jest', 'Pytest', 'Selenium', 'Git', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Agile/Scrum'],
      },
      {
        categoryName: 'Team Collaboration & Stakeholder Engagement',
        skillsList: ['Technical Leadership', 'Code Review', 'Mentoring', 'Project Management', 'Cross-functional Collaboration'],
      },
    ],
  };
}

export const openAIService = {
  generateCVContent: generateCVContentWithAI,
};
