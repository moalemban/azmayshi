import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image uploaded.' }, { status: 400 });
    }
    
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Compress the image using sharp
    const outputBuffer = await sharp(fileBuffer)
      .webp({ quality: 80 })
      .toBuffer();
    
    // Send the compressed image back
    const headers = new Headers();
    headers.set('Content-Type', 'image/webp');
    headers.set('Content-Length', outputBuffer.length.toString());

    return new NextResponse(outputBuffer, { status: 200, headers });

  } catch (error) {
    console.error('Compression error:', error);
    return NextResponse.json({ error: 'Failed to compress image.' }, { status: 500 });
  }
}
