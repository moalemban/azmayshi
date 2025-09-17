import sharp from 'sharp';

export interface CompressOptions {
  formats: Array<'jpeg' | 'png' | 'webp' | 'avif'>;
  quality: number; // 1–100
  resize?: { width?: number; height?: number };
  crop?: boolean;
  stripMetadata?: boolean;
  smartMode?: boolean;
}

export async function compressImageBuffer(
  buffer: Buffer,
  options: CompressOptions
): Promise<{ format: string; data: Buffer }[]> {
  const outputs: { format: string; data: Buffer }[] = [];

  for (const fmt of options.formats) {
    let pipeline = sharp(buffer);

    // Resize / Crop
    if (options.resize && (options.resize.width || options.resize.height)) {
      pipeline = pipeline.resize(options.resize.width, options.resize.height, {
        fit: options.crop ? 'cover' : 'inside',
        withoutEnlargement: true, // Don't make images larger
      });
    }

    // Remove metadata if needed
    if (options.stripMetadata) {
      pipeline.withMetadata({
          exif: undefined,
          icc: undefined,
          iptc: undefined,
          xmp: undefined,
          tifftag: undefined,
      });
    }

    // Smart mode: dynamic quality based on initial size
    let quality = options.quality;
    if (options.smartMode) {
      const kb = buffer.length / 1024;
      if (kb > 5000) quality = 65; // Over 5MB -> 65%
      else if (kb > 2000) quality = 75; // Over 2MB -> 75%
      else quality = 85; // Default for smaller images
    }

    // Sharp basic compress
    switch (fmt) {
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        break;
      case 'png':
        // PNG quality in sharp is about compression level (0-9), not visual quality.
        // We'll map the 1-100 quality to a 9-0 scale.
        const compressionLevel = Math.max(0, 9 - Math.floor(quality / 11));
        pipeline = pipeline.png({ quality: quality, compressionLevel, palette: true });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'avif':
        // AVIF is slower but very efficient
        pipeline = pipeline.avif({ quality, speed: 5 }); // speed 0-8, 5 is a good balance
        break;
    }

    const outputBuffer = await pipeline.toBuffer();
    outputs.push({ format: fmt, data: outputBuffer });
  }

  return outputs;
}
