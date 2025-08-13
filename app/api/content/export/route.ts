import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ContentType } from '@/components/content/content-management-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType } = body;

    if (!contentType) {
      return NextResponse.json(
        { error: 'Content type is required' },
        { status: 400 }
      );
    }

    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, `${contentType}.json`);
    
    // Read the content file
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Create response with proper headers for file download
    const response = new NextResponse(JSON.stringify(data, null, 2));
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Content-Disposition', `attachment; filename="${contentType}-${new Date().toISOString().split('T')[0]}.json"`);

    return response;
  } catch (error) {
    console.error('Error exporting content:', error);
    return NextResponse.json(
      { error: 'Failed to export content' },
      { status: 500 }
    );
  }
} 