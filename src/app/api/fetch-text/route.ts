import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Static filename yang sama dengan upload
const STATIC_FILENAME = 'spelling-info';
const FOLDER_NAME = 'text-files';
const FULL_PUBLIC_ID = `${FOLDER_NAME}/${STATIC_FILENAME}`;

export async function GET(request: NextRequest) {
  try {
    let textFileUrl = '';

    try {
      // Check if static file exists
      const resource = await cloudinary.api.resource(FULL_PUBLIC_ID, { 
        resource_type: 'raw' 
      });
      
      textFileUrl = resource.secure_url;
      console.log('Static file found:', textFileUrl);
    } catch (error: any) {
      if (error.http_code === 404) {
        return NextResponse.json(
          { error: 'Text file not found. Please upload a file first.' },
          { status: 404 }
        );
      } else {
        throw error;
      }
    }

    // Fetch content dari Cloudinary
    const response = await fetch(textFileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const textContent = await response.text();

    return NextResponse.json({
      content: textContent,
      url: textFileUrl,
      publicId: FULL_PUBLIC_ID,
      filename: STATIC_FILENAME
    });

  } catch (error) {
    console.error('Error fetching text file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch text file' },
      { status: 500 }
    );
  }
}