import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import formidable from 'formidable';
import fs from 'fs';

// We need to disable the default body parser to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to parse form data
const parseForm = (req: NextRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise((resolve, reject) => {
        const form = formidable({});
        // formidable expects a Node.js request object, but we have a Next.js request.
        // We can convert the body to a readable stream and pipe it.
        // This is a bit of a workaround.
        const reqAsNodeReq: any = req;
        form.parse(reqAsNodeReq, (err, fields, files) => {
            if (err) {
                reject(err);
            }
            resolve({ fields, files });
        });
    });
};


export async function POST(req: NextRequest) {
  try {
    const { files } = await parseForm(req);
    const imageFile = files.image?.[0];

    if (!imageFile) {
      return NextResponse.json({ error: 'No image uploaded.' }, { status: 400 });
    }

    const imagePath = imageFile.filepath;
    
    // Read the file from the temporary path
    const fileBuffer = fs.readFileSync(imagePath);

    // Compress the image using sharp
    const outputBuffer = await sharp(fileBuffer)
      .webp({ quality: 80 })
      .toBuffer();
    
    // Clean up the temporary file
    fs.unlinkSync(imagePath);
    
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
