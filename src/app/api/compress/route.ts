import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const quality = formData.get('quality') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No image provided.' }, { status: 400 });
    }

    const imageQuality = quality ? parseInt(quality, 10) : 80;
    if (isNaN(imageQuality) || imageQuality < 10 || imageQuality > 100) {
      return NextResponse.json({ error: 'Invalid quality value.' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    const optimizedBuffer = await sharp(Buffer.from(buffer))
        .webp({ quality: imageQuality })
        .toBuffer();

    const headers = new Headers();
    headers.set('Content-Type', 'image/webp');
    headers.set('Content-Disposition', `attachment; filename="optimized.webp"`);

    return new NextResponse(optimizedBuffer, { status: 200, headers });

  } catch (error) {
    console.error('Image optimization error:', error);
    return NextResponse.json({ error: 'Failed to optimize image.' }, { status: 500 });
  }
}
