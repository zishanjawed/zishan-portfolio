import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    const backupDir = path.join(process.cwd(), 'data', 'backups');
    
    // Ensure backup directory exists
    try {
      await fs.access(backupDir);
    } catch {
      await fs.mkdir(backupDir, { recursive: true });
    }

    // Read all backup files
    const files = await fs.readdir(backupDir);
    const backupFiles = files.filter(file => file.endsWith('.json'));
    
    const versions = [];

    for (const file of backupFiles) {
      // Filter by type if specified
      if (type && !file.startsWith(type)) {
        continue;
      }

      try {
        const filePath = path.join(backupDir, file);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const backupData = JSON.parse(fileContent);
        
        versions.push({
          id: backupData.id,
          timestamp: backupData.timestamp,
          description: backupData.description,
          author: backupData.author,
          size: backupData.size,
          changes: backupData.changes || [],
          filename: file
        });
      } catch (error) {
        console.error(`Error reading backup file ${file}:`, error);
      }
    }

    // Sort by timestamp (newest first)
    versions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ versions });
  } catch (error) {
    console.error('Error loading backups:', error);
    return NextResponse.json(
      { error: 'Failed to load backups' },
      { status: 500 }
    );
  }
} 