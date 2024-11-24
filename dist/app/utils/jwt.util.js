"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_error_1 = __importDefault(require("../errors/app.error"));
const createToken = (jwtPayload, secret, expiresIn) => {
    return jsonwebtoken_1.default.sign(jwtPayload, secret, { expiresIn });
};
exports.createToken = createToken;
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    } catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new app_error_1.default(
                http_status_codes_1.StatusCodes.UNAUTHORIZED,
                "Invalid token"
            );
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new app_error_1.default(
                http_status_codes_1.StatusCodes.UNAUTHORIZED,
                "Token expired"
            );
        }
        throw new app_error_1.default(
            http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            "Token verification failed"
        );
    }
};
exports.verifyToken = verifyToken;
