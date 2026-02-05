import { NextRequest, NextResponse } from 'next/server';
import { databaseClient } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ profileId: string }> }
) {
  try {
    if (!databaseClient) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const params = await context.params;
    const profileIdentifier = parseInt(params.profileId, 10);

    const foundProfile = await databaseClient.userProfile.findUnique({
      where: { profileId: profileIdentifier },
    });

    if (!foundProfile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile: foundProfile });
  } catch (dbError) {
    console.error('Error fetching profile:', dbError);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ profileId: string }> }
) {
  try {
    if (!databaseClient) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    const params = await context.params;
    const profileIdentifier = parseInt(params.profileId, 10);
    const requestData = await request.json();

    const updatedProfile = await databaseClient.userProfile.update({
      where: { profileId: profileIdentifier },
      data: {
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
      profile: updatedProfile 
    });
  } catch (dbError) {
    console.error('Error updating profile:', dbError);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
