"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const env_1 = __importDefault(require("./env"));
const connectCloudinary = () => {
    cloudinary_1.v2.config({
        cloud_name: env_1.default.cloudinary_cloud_name,
        api_key: env_1.default.cloudinary_api_key,
        api_secret: env_1.default.cloudinary_api_secret,
    });
};
exports.connectCloudinary = connectCloudinary;
