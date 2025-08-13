import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

    // Create response with proper headers for file download
    const response = new NextResponse(JSON.stringify(backupData, null, 2));
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Content-Disposition', `attachment; filename="${contentType}-backup-${versionId}.json"`);

    return response;
  } catch (error) {
    console.error('Error exporting backup:', error);
    return NextResponse.json(
      { error: 'Failed to export backup' },
      { status: 500 }
    );
  }
} 