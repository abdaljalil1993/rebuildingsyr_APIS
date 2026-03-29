import fs from "fs";
import multer from "multer";
import path from "path";
import { Request } from "express";
import { ApiError } from "../utils/api-error";

const uploadDir = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, uniqueName);
  }
});

const fileFilter: multer.Options["fileFilter"] = (
  _req: Request,
  file,
  cb
) => {
  const allowedExt = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    cb(new ApiError(400, "Unsupported file type"));
    return;
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});
