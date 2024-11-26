import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";
import path from "path";
import env from "../config/env";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  [key: string]: any;
}

cloudinary.config({
  cloud_name: env.cloudinary_cloud_name,
  api_key: env.cloudinary_api_key,
  api_secret: env.cloudinary_api_secret,
});

export const sendImageToCloudinary = (imageName: string, path: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName },
      function (error, result) {
        if (error) {
          reject(error);
        }

        resolve(result as CloudinaryUploadResult);

        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File deleted successfully");
          }
        });
      }
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads");

    fs.access(uploadPath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(uploadPath, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            return cb(mkdirErr, uploadPath);
          }
          cb(null, uploadPath);
        });
      } else {
        cb(null, uploadPath);
      }
    });
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
