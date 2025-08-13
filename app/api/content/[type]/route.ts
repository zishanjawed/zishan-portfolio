import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { validateContent } from '@/lib/content/validation';
import { ContentType } from '@/components/content/content-management-client';

export async function PUT(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const contentType = params.type as ContentType;
    const body = await request.json();

    // Validate the content
    const validation = validateContent(contentType, body);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Create backup before saving
    await createBackup(contentType, body);

    // Save the content
    const dataDir = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDir, `${contentType}.json`);
    
    // Wrap the content in the expected format (e.g., { person: {...} })
    const contentToSave = { [contentType]: body };
    
    await fs.writeFile(filePath, JSON.stringify(contentToSave, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: `${contentType} content updated successfully` 
    });
  } catch (error) {
    console.error(`Error updating ${params.type} content:`, error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

async function createBackup(contentType: ContentType, content: any) {
  try {
    const backupDir = path.join(process.cwd(), 'data', 'backups');
    
    // Ensure backup directory exists
    try {
      await fs.access(backupDir);
    } catch {
      await fs.mkdir(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `${contentType}-${timestamp}.json`);
    
    const backupData = {
      id: timestamp,
      timestamp: new Date().toISOString(),
      description: `Auto-backup before content update`,
      author: 'system',
      content,
      size: JSON.stringify(content).length,
      changes: ['Content updated via content management interface']
    };

    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
  } catch (error) {
    console.error('Error creating backup:', error);
    // Don't fail the main operation if backup fails
  }
} 