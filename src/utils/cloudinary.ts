/* eslint-disable @typescript-eslint/no-unsafe-argument */
// src/utils/cloudinary-upload.ts
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

let isCloudinaryConfigured = false;

function ensureCloudinaryConfig() {
  if (!isCloudinaryConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
      api_key: process.env.CLOUDINARY_API_KEY || '',
      api_secret: process.env.CLOUDINARY_API_SECRET || '',
    });

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error('❌ Cloudinary ENV vars are missing!');
    } else {
      console.log('✅ Cloudinary configured');
    }

    isCloudinaryConfigured = true;
  }
}

export async function uploadImagesToCloudinary(
  files: Express.Multer.File[],
  folder = 'nestUpload',
): Promise<string[]> {
  ensureCloudinaryConfig();

  const uploadPromises = files.map(
    (file) =>
      new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'image' },
          (error, result) => {
            if (error)
              return reject(
                error instanceof Error ? error : new Error(String(error)),
              );
            if (result?.secure_url) {
              resolve(result.secure_url);
            } else {
              reject(
                new Error('Failed to upload image: secure_url is undefined'),
              );
            }
          },
        );
        bufferToStream(file.buffer).pipe(uploadStream);
      }),
  );

  return Promise.all(uploadPromises);
}
