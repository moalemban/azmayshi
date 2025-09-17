import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image provided.' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    const optimizedBuffer = await sharp(Buffer.from(buffer))
        .webp({ quality: 80 })
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
