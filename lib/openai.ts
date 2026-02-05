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
          content: 'You are an expert CV writer specializing in tailoring resumes to specific job positions.',
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
  return `Create a professional CV content for the following:

Position: ${positionTitle} at ${organizationName}
${positionDetails ? `Job Requirements:\n${positionDetails}\n` : ''}

Candidate Information:
- Name: ${profileInfo.completeName}
- Title: ${profileInfo.jobTitle || 'Software Engineer'}
- Location: ${profileInfo.cityLocation}
- Phone: ${profileInfo.contactPhone}
- Email: ${profileInfo.contactEmail}
${profileInfo.linkedinProfile ? `- LinkedIn: ${profileInfo.linkedinProfile}` : ''}

Work History:
${profileInfo.jobHistory || 'No work history provided'}

Education:
${profileInfo.academicHistory || 'No education history provided'}

Technical Skills:
${profileInfo.technicalSkills || 'No technical skills provided'}

Generate a JSON response with the following structure:
{
  "professionalOverview": "A compelling 3-4 sentence summary tailored to the job",
  "workExperienceList": [
    {
      "companyName": "Company Name",
      "dateRange": "Start - End",
      "roleTitle": "Position Title",
      "roleDescription": "Brief role description",
      "achievements": ["Achievement with metrics", "Another achievement"],
      "relevantTechnologies": ["Tech1", "Tech2"]
    }
  ],
  "educationList": [
    {
      "institutionName": "University Name",
      "dateRange": "Year - Year",
      "degreeObtained": "Degree Type"
    }
  ],
  "skillCategories": [
    {
      "categoryName": "Programming & Development",
      "skillsList": ["Skill1", "Skill2"]
    }
  ]
}

Focus on quantifiable achievements and keywords from the job requirements.`;
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
      professionalRole: profileInfo.jobTitle || 'Senior Software Engineer & AI Developer',
      locationText: profileInfo.cityLocation,
      phoneNumber: profileInfo.contactPhone,
      emailAddress: profileInfo.contactEmail,
      linkedinUrl: profileInfo.linkedinProfile,
    },
    professionalOverview: `Highly experienced software engineer with **8+ years** of expertise in full-stack development and **AI/ML integration**. Proven track record of delivering **scalable solutions** and leading **cross-functional teams** to achieve **30% efficiency improvements**. Passionate about leveraging cutting-edge technologies to solve complex business challenges.`,
    workExperienceList: [
      {
        companyName: 'Tech Innovations Corp',
        dateRange: '2020 - Present',
        roleTitle: 'Senior Software Engineer',
        roleDescription: 'Leading development of AI-powered applications and mentoring junior developers',
        achievements: [
          'Architected and deployed microservices infrastructure reducing deployment time by **40%**',
          'Implemented ML models improving recommendation accuracy by **25%**',
          'Led team of 6 developers delivering features **15% ahead of schedule**',
        ],
        relevantTechnologies: ['Python', 'TypeScript', 'React', 'AWS', 'TensorFlow'],
      },
      {
        companyName: 'Digital Solutions Ltd',
        dateRange: '2018 - 2020',
        roleTitle: 'Full Stack Developer',
        roleDescription: 'Developed enterprise web applications and RESTful APIs',
        achievements: [
          'Built customer portal serving **50,000+ users** with **99.9% uptime**',
          'Optimized database queries reducing response time by **30%**',
          'Implemented CI/CD pipeline decreasing bugs in production by **20%**',
        ],
        relevantTechnologies: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
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
        skillsList: ['JavaScript/TypeScript', 'Python', 'Java', 'C++', 'Go'],
      },
      {
        categoryName: 'AI & Machine Learning',
        skillsList: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenAI API', 'LangChain'],
      },
      {
        categoryName: 'Documentation & Quality Assurance',
        skillsList: ['Jest', 'Pytest', 'Selenium', 'Git', 'Agile/Scrum'],
      },
      {
        categoryName: 'Team Collaboration & Stakeholder Engagement',
        skillsList: ['Technical Leadership', 'Code Review', 'Mentoring', 'Project Management'],
      },
    ],
  };
}

export const openAIService = {
  generateCVContent: generateCVContentWithAI,
};
