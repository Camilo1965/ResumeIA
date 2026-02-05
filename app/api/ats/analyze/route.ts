import { NextRequest, NextResponse } from 'next/server';
import { atsAnalyzer } from '@/lib/ats-analyzer';
import { CVContent } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { cvContent, jobRequirements } = requestBody;

    // Validate required fields
    if (!cvContent) {
      return NextResponse.json(
        { error: 'CV content is required' },
        { status: 400 }
      );
    }

    // Perform ATS analysis
    const analysis = await atsAnalyzer.analyzeATSCompatibility(
      cvContent as CVContent,
      jobRequirements
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in ATS analysis API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze CV for ATS compatibility' },
      { status: 500 }
    );
  }
}
