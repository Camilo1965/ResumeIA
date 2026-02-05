import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { CVPDFDocument } from '@/components/cv-builder/CVPDFDocument';
import { CVContent } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { cvContent, template, cvLanguage = 'en' } = await request.json();

    if (!cvContent) {
      return NextResponse.json(
        { error: 'CV content is required' },
        { status: 400 }
      );
    }

    // Generate PDF using the pdf() method from @react-pdf/renderer v4
    // Note: Type assertion is needed because @react-pdf/renderer's type definitions
    // expect a Document element directly, but we're passing a component that renders a Document
    const pdfDoc = React.createElement(CVPDFDocument, { 
      cvContent: cvContent as CVContent,
      template: template || 'modern',
      cvLanguage: cvLanguage as 'en' | 'es'
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
