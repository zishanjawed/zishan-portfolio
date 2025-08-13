import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { validateContent } from '@/lib/content/validation';
import { ContentType } from '@/components/content/content-management-client';

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    
    // Read all content files
    const contentTypes: ContentType[] = ['person', 'experience', 'projects', 'skills', 'writing'];
    const contentData: Record<string, any> = {};

    for (const contentType of contentTypes) {
      try {
        const filePath = path.join(dataDir, `${contentType}.json`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        
        // Extract the main content object (e.g., { person: {...} } -> {...})
        const mainKey = Object.keys(data)[0];
        contentData[contentType] = data[mainKey];
      } catch (error) {
        console.error(`Error reading ${contentType}.json:`, error);
        contentData[contentType] = null;
      }
    }

    return NextResponse.json(contentData);
  } catch (error) {
    console.error('Error loading content:', error);
    return NextResponse.json(
      { error: 'Failed to load content data' },
      { status: 500 }
    );
  }
} 