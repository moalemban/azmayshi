'use server';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import JSZip from 'jszip';
import { compressImageBuffer } from '@/lib/compress';
import type { CompressOptions } from '@/lib/compress';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const images = formData.getAll('images') as File[];

    if (!images || images.length === 0) {
      return NextResponse.json({ error: 'No images uploaded.' }, { status: 400 });
    }

    const options: CompressOptions = {
      quality: parseInt(formData.get('quality') as string) || 80,
      formats: (formData.get('formats') as string)?.split(',') as Array<'jpeg' | 'png' | 'webp' | 'avif'> || ['webp'],
      resize: {
        width: formData.has('width') ? parseInt(formData.get('width') as string) : undefined,
        height: formData.has('height') ? parseInt(formData.get('height') as string) : undefined,
      },
      crop: formData.get('crop') === 'true',
      stripMetadata: formData.get('stripMetadata') === 'true',
      smartMode: formData.get('smartMode') === 'true',
    };
    
    const zip = new JSZip();

    for (const imageFile of images) {
      const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
      const originalFilename = imageFile.name.split('.').slice(0, -1).join('.') || 'image';

      const results = await compressImageBuffer(fileBuffer, options);

      results.forEach((resImg) => {
        zip.file(`${originalFilename}.${resImg.format}`, resImg.data);
      });
    }

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', 'attachment; filename="optimized.zip"');
    
    return new NextResponse(zipBuffer, { status: 200, headers });

  } catch (error: any) {
    console.error('Optimization error:', error);
    return NextResponse.json({ error: 'Failed to optimize images.', details: error.message }, { status: 500 });
  }
}
