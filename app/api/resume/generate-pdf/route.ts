import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { CVPDFDocument } from '@/components/cv-builder/CVPDFDocument';
import { CVContent } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { cvContent } = await request.json();

    if (!cvContent) {
      return NextResponse.json(
        { error: 'CV content is required' },
        { status: 400 }
      );
    }

    // Generate PDF using the pdf() method from @react-pdf/renderer v4
    const pdfDoc = React.createElement(CVPDFDocument, { 
      cvContent: cvContent as CVContent 
    });
    
    const pdfInstance = pdf(pdfDoc as any);
    const pdfBlob = await pdfInstance.toBlob();
    
    // Convert Blob to ArrayBuffer
    const arrayBuffer = await pdfBlob.arrayBuffer();

    // Return PDF as response
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${Date.now()}.pdf"`,
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
