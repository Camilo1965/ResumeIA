import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { CVPDFDocument } from '@/components/cv-builder/CVPDFDocument';
import { CVContent } from '@/types';
import { databaseClient } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cvId = parseInt(id, 10);

    if (!databaseClient) {
      // Return a mock PDF or error for demo purposes
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      );
    }

    // Fetch the CV from database
    const cv = await databaseClient.generatedCV.findUnique({
      where: { cvId },
      include: {
        userProfile: true,
      },
    });

    if (!cv) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      );
    }

    // Parse the AI-generated content
    let cvContent: CVContent;
    try {
      cvContent = JSON.parse(cv.aiGeneratedText);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid CV content' },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfDoc = React.createElement(CVPDFDocument, { 
      cvContent: cvContent as CVContent 
    });
    
    const pdfInstance = pdf(pdfDoc as any);
    const pdfBlob = await pdfInstance.toBlob();
    
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await pdfBlob.arrayBuffer();

    // Create filename from profile and company name
    const profileName = cv.userProfile.completeName.replace(/\s+/g, '_');
    const companyName = cv.organizationName.replace(/\s+/g, '_');
    const position = cv.positionTitle.replace(/\s+/g, '_').slice(0, 30);
    const filename = `${profileName}_${companyName}_${position}.pdf`;

    // Return PDF as response
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
