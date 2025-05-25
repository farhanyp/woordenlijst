import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function GET() {
  try {
    const filePath = path.join(UPLOAD_DIR, 'upload.txt');
    
    // Cek apakah file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Baca content file
    const content = await fs.readFile(filePath, 'utf-8');
    const stats = await fs.stat(filePath);

    return NextResponse.json({
      content,
      url: '/uploads/upload.txt',
      publicId: 'upload',
      filename: 'upload',
      size: stats.size,
      lastModified: stats.mtime
    });

  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    );
  }
}