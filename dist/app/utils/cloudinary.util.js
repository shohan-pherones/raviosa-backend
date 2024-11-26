"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.sendImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const env_1 = __importDefault(require("../config/env"));
cloudinary_1.v2.config({
    cloud_name: env_1.default.cloudinary_cloud_name,
    api_key: env_1.default.cloudinary_api_key,
    api_secret: env_1.default.cloudinary_api_secret,
});
const sendImageToCloudinary = (imageName, path) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload(path, { public_id: imageName }, function (error, result) {
            if (error) {
                reject(error);
            }
            resolve(result);
            fs_1.default.unlink(path, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("File deleted successfully");
                }
            });
        });
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path_1.default.join(process.cwd(), "uploads");
        fs_1.default.access(uploadPath, fs_1.default.constants.F_OK, (err) => {
            if (err) {
                fs_1.default.mkdir(uploadPath, { recursive: true }, (mkdirErr) => {
                    if (mkdirErr) {
                        return cb(mkdirErr, uploadPath);
                    }
                    cb(null, uploadPath);
                });
            }
            else {
                cb(null, uploadPath);
            }
        });
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
