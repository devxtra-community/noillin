import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3Client } from "../lib/s3.client.js";

export const generateUploadUrlService = async (
  folder: string,
  fileName: string,
  fileType: string
) => {

  const uniqueFileName = `${Date.now()}-${fileName}`;

  const key = `${folder}/${uniqueFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: fileType
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300
  });

  const fileUrl =
    `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    uploadUrl,
    fileUrl
  };
};

interface MulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export const uploadFilesService = async (
  files: MulterFile[],
  folder: string
): Promise<string[]> => {
  const uploadPromises = files.map(async (file) => {
    const uniqueFileName = `${Date.now()}-${file.originalname}`;
    const key = `${folder}/${uniqueFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  });

  return Promise.all(uploadPromises);
};