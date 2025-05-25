import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const STATIC_FILENAME = 'spelling-info';
const FOLDER_NAME = 'text-files';
const FULL_PUBLIC_ID = `${FOLDER_NAME}/${STATIC_FILENAME}`;

export async function GET() {
  try {
    const resource = await cloudinary.api.resource(FULL_PUBLIC_ID, { 
      resource_type: 'raw' 
    });
    
    return NextResponse.json({
      exists: true,
      url: resource.secure_url,
      publicId: resource.public_id,
      filename: STATIC_FILENAME,
      createdAt: resource.created_at,
      bytes: resource.bytes
    });
  } catch (error: any) {
    if (error.http_code === 404) {
      return NextResponse.json({
        exists: false,
        filename: STATIC_FILENAME
      });
    }
    
    console.error('Error checking file:', error);
    return NextResponse.json(
      { error: 'Failed to check file status' },
      { status: 500 }
    );
  }
}