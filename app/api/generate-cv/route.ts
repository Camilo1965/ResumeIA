import { NextRequest, NextResponse } from 'next/server';
import { databaseClient } from '@/lib/prisma';
import { openAIService } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const {
      userProfileId,
      positionTitle,
      organizationName,
      jobPostingUrl,
      positionDetails,
      displayLinkedin,
    } = requestBody;

    // Validate required fields
    if (!positionTitle || !organizationName) {
      return NextResponse.json(
        { error: 'Position title and organization name are required' },
        { status: 400 }
      );
    }

    // Fetch user profile (or use mock data if not found)
    let userProfile;
    if (databaseClient) {
      try {
        userProfile = await databaseClient.userProfile.findUnique({
          where: { profileId: userProfileId },
        });
      } catch (dbError) {
        console.log('Database error, using mock profile:', dbError);
        userProfile = null;
      }
    }

    // Use mock profile if database is not available
    if (!userProfile) {
      userProfile = {
        profileId: 1,
        completeName: 'John Doe',
        jobTitle: 'Senior Software Engineer',
        contactPhone: '+1 (555) 123-4567',
        contactEmail: 'john.doe@example.com',
        cityLocation: 'San Francisco, CA',
        linkedinProfile: 'linkedin.com/in/johndoe',
        displayLinkedin: true,
        jobHistory: 'Senior Engineer at TechCorp (2020-Present)\nFull Stack Developer at StartupXYZ (2018-2020)',
        academicHistory: 'B.S. Computer Science, Tech University (2014-2018)',
        technicalSkills: 'JavaScript, TypeScript, Python, React, Node.js, AWS',
        selectedTemplate: 'minimalist',
        bgPattern: 'hexagon',
        profileCreatedAt: new Date(),
        profileUpdatedAt: new Date(),
      };
    }

    // Generate CV content with AI
    const cvContent = await openAIService.generateCVContent(
      {
        ...userProfile,
        jobTitle: userProfile.jobTitle || undefined,
        linkedinProfile: userProfile.linkedinProfile || undefined,
        jobHistory: userProfile.jobHistory || undefined,
        academicHistory: userProfile.academicHistory || undefined,
        technicalSkills: userProfile.technicalSkills || undefined,
        selectedTemplate: userProfile.selectedTemplate as 'modern' | 'classic' | 'minimalist',
        bgPattern: userProfile.bgPattern as 'none' | 'particle_dots' | 'dot_flow' | 'hexagon',
      },
      positionTitle,
      organizationName,
      positionDetails
    );

    // Override LinkedIn display if specified
    if (displayLinkedin === false) {
      cvContent.headerInfo.linkedinUrl = undefined;
    }

    // Save to database (if available)
    if (databaseClient) {
      try {
        await databaseClient.generatedCV.create({
          data: {
            userProfileId: userProfile.profileId,
            positionTitle,
            organizationName,
            jobPostingUrl: jobPostingUrl || null,
            positionDetails: positionDetails || null,
            aiGeneratedText: JSON.stringify(cvContent),
          },
        });
      } catch (dbError) {
        console.log('Could not save to database:', dbError);
        // Continue without saving to database
      }
    }

    return NextResponse.json({ cvContent });
  } catch (error) {
    console.error('Error in generate-cv API:', error);
    return NextResponse.json(
      { error: 'Failed to generate CV' },
      { status: 500 }
    );
  }
}
