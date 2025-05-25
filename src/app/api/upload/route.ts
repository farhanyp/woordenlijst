import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Static filename yang akan selalu digunakan
const STATIC_FILENAME = 'spelling-info';
const FOLDER_NAME = 'text-files';
const FULL_PUBLIC_ID = `${FOLDER_NAME}/${STATIC_FILENAME}`;

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

    // Check if file is a text file
    if (!file.type.includes('text') && !file.name.endsWith('.txt')) {
      return NextResponse.json(
        { error: 'Only text files are allowed' },
        { status: 400 }
      );
    }

    // Check file size (limit to 1MB for text files)
    if (file.size > 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum 1MB allowed.' },
        { status: 400 }
      );
    }

    // Check if file already exists and delete it
    try {
      await cloudinary.api.resource(FULL_PUBLIC_ID, { resource_type: 'raw' });
      // File exists, delete it first
      console.log('Existing file found, deleting...');
      await cloudinary.uploader.destroy(FULL_PUBLIC_ID, { resource_type: 'raw' });
      console.log('Old file deleted successfully');
    } catch (error: any) {
      if (error.http_code === 404) {
        console.log('No existing file found, proceeding with upload...');
      } else {
        console.error('Error checking/deleting existing file:', error);
        // Continue with upload even if delete fails
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload new file with static filename
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: FOLDER_NAME,
          public_id: STATIC_FILENAME,
          use_filename: false, // Don't use original filename
          unique_filename: false, // Don't add unique suffix
          overwrite: true, // Allow overwrite (as backup)
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: (result as any).secure_url,
      publicId: (result as any).public_id,
      filename: STATIC_FILENAME,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}