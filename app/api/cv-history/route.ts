import { NextResponse } from 'next/server';
import { databaseClient } from '@/lib/prisma';

export async function GET() {
  try {
    if (!databaseClient) {
      // Return mock data when database is not configured
      return NextResponse.json({
        cvHistory: [
          {
            cvId: 1,
            profileOwnerName: 'Demo User',
            organizationName: 'Example Corp',
            positionTitle: 'Software Engineer',
            lastModifiedDate: '2024-01-20',
          },
        ],
      });
    }

    const allCVs = await databaseClient.generatedCV.findMany({
      include: {
        userProfile: {
          select: {
            completeName: true,
          },
        },
      },
      orderBy: { cvUpdatedAt: 'desc' },
    });

    const formattedHistory = allCVs.map((cv) => ({
      cvId: cv.cvId,
      profileOwnerName: cv.userProfile.completeName,
      organizationName: cv.organizationName,
      positionTitle: cv.positionTitle,
      lastModifiedDate: cv.cvUpdatedAt.toISOString().split('T')[0],
    }));

    return NextResponse.json({ cvHistory: formattedHistory });
  } catch (dbError) {
    console.log('Database error, returning mock data:', dbError);

    return NextResponse.json({
      cvHistory: [
        {
          cvId: 1,
          profileOwnerName: 'Demo User',
          organizationName: 'Example Corp',
          positionTitle: 'Software Engineer',
          lastModifiedDate: '2024-01-20',
        },
      ],
    });
  }
}
