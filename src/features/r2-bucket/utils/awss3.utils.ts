import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.AWS_S3_API_URL ?? "",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

export async function uploadFileToS3(params: {
  file: File;
  prefix: string;
  filename: string;
}) {
  const filebuffer = await params.file.arrayBuffer();
  const buffer = Buffer.from(filebuffer);
  const key = buildObjectKey({
    prefix: params.prefix,
    filename: params.filename,
  });

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME ?? "",
    Key: key,
    Body: buffer,
    ContentType: params.file.type,
  });

  try {
    await s3Client.send(command);

    return {
      url: buildR2PublicUrl(key),
    };
  } catch (error) {
    throw error;
  }
}

export function buildObjectKey(params: { prefix: string; filename: string }) {
  const { prefix, filename } = params;
  const dotIndex = filename.lastIndexOf(".");
  const hasExt = dotIndex > 0 && dotIndex < filename.length - 1;
  const baseName = hasExt ? filename.slice(0, dotIndex) : filename;
  const extension = hasExt ? filename.slice(dotIndex + 1) : "";
  const safeBase = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
  const id = nanoid(8);
  const key = extension
    ? `${prefix}/${safeBase}-${id}.${extension}`
    : `${prefix}/${safeBase}-${id}`;
  return key;
}

export function buildR2PublicUrl(key: string) {
  const base = (process.env.R2_URL ?? "").replace(/\/+$/, "");
  const bucket = process.env.AWS_S3_BUCKET_NAME ?? "";
  return `${base}/${bucket}/${key}`;
}
