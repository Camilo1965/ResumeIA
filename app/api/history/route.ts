import { NextRequest, NextResponse } from 'next/server';
import { databaseClient } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profileName = searchParams.get('profileName') || '';
    const companyName = searchParams.get('companyName') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);

    if (!databaseClient) {
      // Return mock data when database is not configured
      const mockData = [
        {
          cvId: 1,
          profileOwnerName: 'Camilo Gonzalez',
          organizationName: 'caseware',
          positionTitle: 'Senior Software Developer, AI Platform',
          lastModifiedDate: '2026-02-05 01:15',
          pdfUrl: '/api/resume/1/pdf',
          shareUrl: '/share/abc123',
        },
        {
          cvId: 2,
          profileOwnerName: 'Camilo Gonzalez',
          organizationName: 'Svitla',
          positionTitle: 'Sr FullStack AI Engineer',
          lastModifiedDate: '2026-02-05 01:00',
          pdfUrl: '/api/resume/2/pdf',
          shareUrl: '/share/def456',
        },
        {
          cvId: 3,
          profileOwnerName: 'Camilo Gonzalez',
          organizationName: 'NuBank',
          positionTitle: 'Senior Software Engineer',
          lastModifiedDate: '2026-02-05 00:55',
          pdfUrl: '/api/resume/3/pdf',
          shareUrl: '/share/ghi789',
        },
      ];

      // Apply filters
      let filtered = mockData;
      if (profileName) {
        filtered = filtered.filter((cv) =>
          cv.profileOwnerName.toLowerCase().includes(profileName.toLowerCase())
        );
      }
      if (companyName) {
        filtered = filtered.filter((cv) =>
          cv.organizationName.toLowerCase().includes(companyName.toLowerCase())
        );
      }

      // Apply pagination
      const total = filtered.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filtered.slice(startIndex, endIndex);

      return NextResponse.json({
        data: paginatedData,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });
    }

    // Build where clause for filtering
    const whereClause: any = {};
    
    if (profileName) {
      whereClause.userProfile = {
        completeName: {
          contains: profileName,
          mode: 'insensitive',
        },
      };
    }
    
    if (companyName) {
      whereClause.organizationName = {
        contains: companyName,
        mode: 'insensitive',
      };
    }

    // Get total count
    const total = await databaseClient.generatedCV.count({
      where: whereClause,
    });

    // Fetch paginated results
    const allCVs = await databaseClient.generatedCV.findMany({
      where: whereClause,
      include: {
        userProfile: {
          select: {
            completeName: true,
          },
        },
      },
      orderBy: { cvUpdatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedHistory = allCVs.map((cv: any) => ({
      cvId: cv.cvId,
      profileOwnerName: cv.userProfile.completeName,
      organizationName: cv.organizationName,
      positionTitle: cv.positionTitle,
      lastModifiedDate: new Date(cv.cvUpdatedAt).toISOString().slice(0, 16).replace('T', ' '),
      pdfUrl: `/api/resume/${cv.cvId}/pdf`,
      shareUrl: `/share/${cv.cvId}`,
    }));

    return NextResponse.json({
      data: formattedHistory,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (dbError) {
    console.log('Database error, returning mock data:', dbError);

    // Mock data fallback
    const mockData = [
      {
        cvId: 1,
        profileOwnerName: 'Camilo Gonzalez',
        organizationName: 'caseware',
        positionTitle: 'Senior Software Developer, AI Platform',
        lastModifiedDate: '2026-02-05 01:15',
        pdfUrl: '/api/resume/1/pdf',
        shareUrl: '/share/abc123',
      },
      {
        cvId: 2,
        profileOwnerName: 'Camilo Gonzalez',
        organizationName: 'Svitla',
        positionTitle: 'Sr FullStack AI Engineer',
        lastModifiedDate: '2026-02-05 01:00',
        pdfUrl: '/api/resume/2/pdf',
        shareUrl: '/share/def456',
      },
      {
        cvId: 3,
        profileOwnerName: 'Camilo Gonzalez',
        organizationName: 'NuBank',
        positionTitle: 'Senior Software Engineer',
        lastModifiedDate: '2026-02-05 00:55',
        pdfUrl: '/api/resume/3/pdf',
        shareUrl: '/share/ghi789',
      },
    ];

    return NextResponse.json({
      data: mockData,
      pagination: {
        page: 1,
        limit: 15,
        total: mockData.length,
        totalPages: 1,
      },
    });
  }
}
