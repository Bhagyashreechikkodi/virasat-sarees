import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse } from "cloudinary";

export function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
}

export function uploadBufferToCloudinary(
  buffer: Buffer,
  options: { resourceType: "image" | "video"; filename?: string },
): Promise<UploadApiResponse> {
  const client = configureCloudinary();
  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: "royal-silks",
        resource_type: options.resourceType,
        use_filename: true,
        unique_filename: true,
        filename_override: options.filename,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed."));
          return;
        }
        resolve(result);
      },
    );
    stream.end(buffer);
  });
}
