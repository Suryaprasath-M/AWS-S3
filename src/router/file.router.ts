import express from "express";
import multer from "multer";
import { uploadFile } from "../controller/file.controller";
import { getAllImages } from "../middleware/s3client"; // Import the controller function

const router = express.Router();

// Use memory storage for direct upload to S3
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/files/upload
router.post("/upload", upload.single("File"), uploadFile);
router.get("/images", getAllImages);


export default router;