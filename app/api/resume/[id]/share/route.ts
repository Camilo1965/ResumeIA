import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cvId = id;
    
    // Generate a share token (in a real app, this would be stored in a database)
    // For now, we'll use a simple base64 encoding of the CV ID with a timestamp
    const timestamp = Date.now();
    const shareToken = Buffer.from(`${cvId}-${timestamp}`).toString('base64url');
    
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/share/${shareToken}`;
    
    return NextResponse.json({
      shareUrl,
      shareToken,
    });
  } catch (error) {
    console.error('Error generating share link:', error);
    return NextResponse.json(
      { error: 'Failed to generate share link' },
      { status: 500 }
    );
  }
}
