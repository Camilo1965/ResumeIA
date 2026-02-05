import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import ReactPDF from '@react-pdf/renderer';
import { Document } from '@react-pdf/renderer';
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

    // Generate PDF using renderToBuffer - cast to any to bypass type checking
    const pdfDoc = React.createElement(CVPDFDocument, { 
      cvContent: cvContent as CVContent 
    }) as any;
    
    const pdfBuffer = await ReactPDF.renderToBuffer(pdfDoc);

    // Return PDF as response - convert Buffer to Uint8Array
    return new NextResponse(new Uint8Array(pdfBuffer), {
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
