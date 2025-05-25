import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Directory untuk menyimpan file di public/uploads
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Pastikan directory upload exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validasi file type - hanya .txt yang diperbolehkan
    if (!file.name.endsWith('.txt') && file.type !== 'text/plain') {
      return NextResponse.json(
        { error: 'Only .txt files are allowed' },
        { status: 400 }
      );
    }

    // Validasi ukuran file (maksimum 1MB)
    if (file.size > 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 1MB allowed.' },
        { status: 400 }
      );
    }

    // Pastikan upload directory exists
    await ensureUploadDir();

    // Baca content file
    const fileContent = await file.text();

    // Path file dengan nama statik "upload.txt"
    const staticFilePath = path.join(UPLOAD_DIR, 'upload.txt');

    // Cek apakah file sudah ada
    let fileExists = false;
    try {
      await fs.access(staticFilePath);
      fileExists = true;
    } catch {
      fileExists = false;
    }

    // Simpan atau replace file dengan nama "upload.txt"
    await fs.writeFile(staticFilePath, fileContent, 'utf-8');

    const message = fileExists 
      ? 'File upload.txt has been successfully replaced'
      : 'File upload.txt has been successfully uploaded';

    return NextResponse.json({
      message,
      url: '/uploads/upload.txt', // URL untuk akses publik
      publicId: 'upload',
      filename: 'upload',
      fileSize: file.size,
      replaced: fileExists,
      content: fileContent.substring(0, 100) + (fileContent.length > 100 ? '...' : '')
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// GET method untuk cek apakah file upload.txt ada
export async function GET() {
  try {
    await ensureUploadDir();
    
    const filePath = path.join(UPLOAD_DIR, 'upload.txt');
    
    try {
      const stats = await fs.stat(filePath);
      const content = await fs.readFile(filePath, 'utf-8');
      
      return NextResponse.json({
        exists: true,
        name: 'upload.txt',
        size: stats.size,
        lastModified: stats.mtime,
        url: '/uploads/upload.txt',
        preview: content.substring(0, 100) + (content.length > 100 ? '...' : '')
      });
    } catch {
      return NextResponse.json({
        exists: false,
        message: 'File upload.txt does not exist yet'
      });
    }

  } catch (error) {
    console.error('Error checking file:', error);
    return NextResponse.json(
      { error: 'Failed to check file' },
      { status: 500 }
    );
  }
}