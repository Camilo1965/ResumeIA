import { NextRequest, NextResponse } from 'next/server';
import { parseManualLinkedInData, isValidLinkedInUrl } from '@/lib/linkedin-parser';
import type { LinkedInImportRequest, LinkedInImportResponse } from '@/types';

/**
 * POST /api/linkedin/import
 * 
 * Import LinkedIn profile data
 * Supports manual data paste or URL (URL support is limited due to LinkedIn restrictions)
 */
export async function POST(request: NextRequest) {
  try {
    const body: LinkedInImportRequest = await request.json();
    
    if (!body.linkedinUrl && !body.manualData) {
      return NextResponse.json<LinkedInImportResponse>(
        { 
          success: false, 
          error: 'Either linkedinUrl or manualData is required' 
        },
        { status: 400 }
      );
    }

    let parsedData;

    // Handle manual data paste (primary method)
    if (body.manualData) {
      parsedData = parseManualLinkedInData(body.manualData);
    }
    // Handle LinkedIn URL (limited functionality)
    else if (body.linkedinUrl) {
      // Validate URL format
      if (!isValidLinkedInUrl(body.linkedinUrl)) {
        return NextResponse.json<LinkedInImportResponse>(
          { 
            success: false, 
            error: 'Invalid LinkedIn URL format. Expected: https://linkedin.com/in/username' 
          },
          { status: 400 }
        );
      }

      // For URL-based import, we can only store the URL itself
      // Actual scraping would require LinkedIn API approval or third-party services
      parsedData = {
        linkedinUrl: body.linkedinUrl,
      };

      // Note: In a production environment, you might integrate with services like:
      // - Proxycurl API
      // - RapidAPI LinkedIn scrapers
      // - Official LinkedIn API (requires approval)
    }

    // Validate that we got some data
    if (!parsedData || Object.keys(parsedData).length === 0) {
      return NextResponse.json<LinkedInImportResponse>(
        { 
          success: false, 
          error: 'Could not parse any data from the provided input' 
        },
        { status: 400 }
      );
    }

    return NextResponse.json<LinkedInImportResponse>({
      success: true,
      data: parsedData,
    });

  } catch (error) {
    console.error('Error importing LinkedIn data:', error);
    return NextResponse.json<LinkedInImportResponse>(
      { 
        success: false, 
        error: 'Failed to process LinkedIn data' 
      },
      { status: 500 }
    );
  }
}
