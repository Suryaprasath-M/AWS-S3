import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";
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
  const fileExtension = file.originalname.split(".").pop();
  const key = `${uuid()}.${fileExtension}`;
  
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const result = await s3.send(new PutObjectCommand(uploadParams));

  // Manually construct the URL
  const fileUrl = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

  return {
    ...result,
    Location: fileUrl,
  };

}; 

// export const s3UploadFile = async (file: Express.Multer.File) => {
//   const fileExtension = file.originalname.split(".").pop();
//   const key = `${uuid()}.${fileExtension}`;

//   const command = new PutObjectCommand({
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Key: key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   });

//   return await s3.send(command);
// };



// import AWS from "aws-sdk";
// import { v4 as uuid } from "uuid";  
// import dotenv from "dotenv";

// dotenv.config();

// const s3 = new AWS.S3({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY!,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS!,
//   },
//   region: process.env.AWS_REGION,
// });

// export const s3UploadFile = (file: Express.Multer.File) => {
//   const fileExtension = file.originalname.split(".").pop();
//   const key = `${uuid()}.${fileExtension}`;

//   const uploadParams = {
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Key: key,
//     Body: file.buffer,
//     ContentType: file.mimetype,
//   };

//   console.log("Bucket:", process.env.AWS_BUCKET_NAME); // TEMP DEBUG


//   return s3.upload(uploadParams).promise();
// };