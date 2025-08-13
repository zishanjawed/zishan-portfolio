import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { validateContent } from '@/lib/content/validation';
import { ContentType } from '@/components/content/content-management-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentType, versionId } = body;

    if (!contentType || !versionId) {
      return NextResponse.json(
        { error: 'Content type and version ID are required' },
        { status: 400 }
      );
    }

    const backupDir = path.join(process.cwd(), 'data', 'backups');
    const backupFiles = await fs.readdir(backupDir);
    
    // Find the backup file for this version
    const backupFile = backupFiles.find(file => 
      file.startsWith(contentType) && file.includes(versionId)
    );

    if (!backupFile) {
      return NextResponse.json(
        { error: 'Backup version not found' },
        { status: 404 }
      );
    }

    // Read the backup file
    const backupPath = path.join(backupDir, backupFile);
    const backupContent = await fs.readFile(backupPath, 'utf-8');
    const backupData = JSON.parse(backupContent);

    // Validate the restored content
    const validation = validateContent(contentType as ContentType, backupData.content);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Restored content validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Create a backup of current content before restoring
    const dataDir = path.join(process.cwd(), 'data');
    const currentFilePath = path.join(dataDir, `${contentType}.json`);
    
    try {
      const currentContent = await fs.readFile(currentFilePath, 'utf-8');
      const currentData = JSON.parse(currentContent);
      const mainKey = Object.keys(currentData)[0];
      
      // Create backup of current version
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const currentBackupPath = path.join(backupDir, `${contentType}-current-${timestamp}.json`);
      
      const currentBackupData = {
        id: timestamp,
        timestamp: new Date().toISOString(),
        description: `Backup before restoring to version ${versionId}`,
        author: 'system',
        content: currentData[mainKey],
        size: JSON.stringify(currentData[mainKey]).length,
        changes: [`Restored from version ${versionId}`]
      };

      await fs.writeFile(currentBackupPath, JSON.stringify(currentBackupData, null, 2));
    } catch (error) {
      console.error('Error creating backup of current content:', error);
      // Continue with restore even if backup fails
    }

    // Restore the content
    const contentToSave = { [contentType]: backupData.content };
    await fs.writeFile(currentFilePath, JSON.stringify(contentToSave, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: `Content restored from version ${versionId}`,
      content: backupData.content
    });
  } catch (error) {
    console.error('Error restoring content:', error);
    return NextResponse.json(
      { error: 'Failed to restore content' },
      { status: 500 }
    );
  }
} 