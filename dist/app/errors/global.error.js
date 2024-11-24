"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = __importDefault(require("./app.error"));
const globalErrorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof app_error_1.default) {
        res.status(err.statusCode).json({ message: err.message });
    }
    else {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ message: "Internal Server Error" });
    }
};
exports.default = globalErrorHandler;
