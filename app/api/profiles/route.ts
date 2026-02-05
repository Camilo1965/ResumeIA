import { NextRequest, NextResponse } from 'next/server';
import { databaseClient } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { resumeAIAuthConfiguration } from '@/lib/auth-setup';

export async function GET() {
  try {
    if (!databaseClient) {
      return NextResponse.json({
        profiles: [
          {
            profileId: 1,
            completeName: 'Demo User',
            technicalSkills: 'JavaScript, Python, React',
            contactPhone: '+1-555-0100',
            cityLocation: 'San Francisco, CA',
            ownerName: 'Demo User',
          },
        ],
      });
    }

    const sessionData = await getServerSession(resumeAIAuthConfiguration);
    
    if (!sessionData?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userProfiles = await databaseClient.userProfile.findMany({
      where: { ownedByUserId: sessionData.user.id },
      orderBy: { profileCreatedAt: 'desc' },
    });

    const formattedProfiles = userProfiles.map((p: any) => ({
      profileId: p.profileId,
      completeName: p.completeName,
      technicalSkills: p.technicalSkills || 'Not specified',
      contactPhone: p.contactPhone,
      cityLocation: p.cityLocation,
      ownerName: p.completeName,
    }));

    return NextResponse.json({ profiles: formattedProfiles });
  } catch (dbError) {
    console.log('Database error, returning mock data:', dbError);
    
    return NextResponse.json({
      profiles: [
        {
          profileId: 1,
          completeName: 'Demo User',
          technicalSkills: 'JavaScript, Python, React',
          contactPhone: '+1-555-0100',
          cityLocation: 'San Francisco, CA',
          ownerName: 'Demo User',
        },
      ],
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!databaseClient) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const sessionData = await getServerSession(resumeAIAuthConfiguration);
    
    if (!sessionData?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const requestData = await request.json();

    const newProfile = await databaseClient.userProfile.create({
      data: {
        ownedByUserId: sessionData.user.id,
        completeName: requestData.completeName,
        jobTitle: requestData.jobTitle || null,
        contactPhone: requestData.contactPhone,
        contactEmail: requestData.contactEmail,
        cityLocation: requestData.cityLocation,
        linkedinProfile: requestData.linkedinProfile || null,
        displayLinkedin: requestData.displayLinkedin ?? true,
        jobHistory: requestData.jobHistory || null,
        academicHistory: requestData.academicHistory || null,
        technicalSkills: requestData.technicalSkills || null,
        selectedTemplate: requestData.selectedTemplate || 'minimalist',
        bgPattern: requestData.bgPattern || 'hexagon',
      },
    });

    return NextResponse.json({ 
      success: true, 
      profile: newProfile 
    });
  } catch (dbError) {
    console.error('Error creating profile:', dbError);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}
