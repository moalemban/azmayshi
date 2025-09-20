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
    let optimizedBuffer;
    let outputContentType = file.type;
    let outputExtension = file.name.split('.').pop()?.toLowerCase() || 'dat';

    const sharpInstance = sharp(Buffer.from(buffer));

    switch (file.type) {
        case 'image/jpeg':
            optimizedBuffer = await sharpInstance.jpeg({ quality: imageQuality, mozjpeg: true }).toBuffer();
            outputExtension = 'jpg';
            break;
        case 'image/png':
            optimizedBuffer = await sharpInstance.png({ quality: imageQuality }).toBuffer();
            outputExtension = 'png';
            break;
        case 'image/webp':
            optimizedBuffer = await sharpInstance.webp({ quality: imageQuality }).toBuffer();
            outputExtension = 'webp';
            break;
        case 'image/avif':
             optimizedBuffer = await sharpInstance.avif({ quality: imageQuality }).toBuffer();
            outputExtension = 'avif';
            break;
        case 'image/tiff':
             optimizedBuffer = await sharpInstance.tiff({ quality: imageQuality }).toBuffer();
            outputExtension = 'tiff';
            break;
        case 'image/gif':
             optimizedBuffer = await sharpInstance.gif().toBuffer();
            outputExtension = 'gif';
            break;
        default:
            // Fallback for unsupported types, try to convert to jpeg
            outputContentType = 'image/jpeg';
            outputExtension = 'jpg';
            optimizedBuffer = await sharpInstance.jpeg({ quality: imageQuality, mozjpeg: true }).toBuffer();
            break;
    }


    const headers = new Headers();
    headers.set('Content-Type', outputContentType);
    const originalName = file.name.split('.').slice(0, -1).join('.');
    headers.set('Content-Disposition', `attachment; filename="${originalName}_optimized.${outputExtension}"`);

    return new NextResponse(optimizedBuffer, { status: 200, headers });

  } catch (error) {
    console.error('Image optimization error:', error);
    return NextResponse.json({ error: 'Failed to optimize image.' }, { status: 500 });
  }
}
