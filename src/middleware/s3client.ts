import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { GetObjectCommand , ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import { v4 as uuidv4 } from "uuid"; // Ensure you have this import for generating unique ID
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS!,
  },
  region: process.env.AWS_REGION!,
  endpoint: process.env.AWS_ENDPOINT, // Optional, if you are using a custom endpoint
  forcePathStyle: true, // Use path-style URLs for S3
  // This is useful for local S3-compatible services like MinIO

});


export const s3UploadFile = async (file: Express.Multer.File) => {
  const fileExtension = file.originalname.split('.').pop();
  const originalName = file.originalname.replace(/\s+/g, "_");
  const key = `uploads/${uuid()}_${originalName}`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  const signedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: uploadParams.Bucket, Key: key }),
    { expiresIn: 3600 }
  );

  return {
    message: "Upload successful",
    key,
    signedUrl
  };
};

export const getAllImages = async (req: any, res: any) => {
  try {
    const bucket = process.env.AWS_BUCKET_NAME!;
    const prefix = "uploads/"; // your folder prefix, if any

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix, // if you store files inside a folder like uploads/
    });

    const result = await s3.send(command);

    if (!result.Contents) return res.status(200).json([]);

    const images = await Promise.all(
      result.Contents.map(async (item) => {
        const signedUrl = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: bucket,
            Key: item.Key!,
          }),
          { expiresIn: 3600 } // 1 hour validity
        );

        return {
          key: item.Key,
          url: signedUrl,
        };
      })
    );

    res.status(200).json(images);
  } catch (err) {
    console.error("Error fetching image list:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};






// export const s3UploadFile = async (file: Express.Multer.File) => {
//   const fileExtension = file.originalname.split(".").pop();
//   const key = `${uuid()}.${fileExtension}`;
  
//   const uploadParams = {
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Key: key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   const result = await s3.send(new PutObjectCommand(uploadParams));

//   // Manually construct the URL
//   const fileUrl = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

//   return {
//     ...result,
//     Location: fileUrl,
//   };
  

// };


// async function generateSignedUrl() {
//   const command = new GetObjectCommand({
//     Bucket: "getting-started-image",
//     Key: "4b8faa6f-e497-4447-b5e0-2967c0bc34c4.jpeg"
//   });

//   try {
//     const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
//     console.log("Secure URL:", url);
//   } catch (err) {
//     console.error("Failed to generate signed URL:", err);
//   }
// }

// generateSignedUrl();

// export const s3GetFile = async (key: string) => {
//   const command = new GetObjectCommand({
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Key: key,
//   });

//   try {
//     const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
//     return url;
//   } catch (err) {
//     console.error("Failed to generate signed URL:", err);
//     throw err;
//   }
// };  

