"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const env_1 = __importDefault(require("../config/env"));
const app_error_1 = __importDefault(require("../errors/app.error"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const jwt_util_1 = require("../utils/jwt.util");
const auth = (...roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = req.headers.authorization;
            if (!token) {
                throw new app_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized");
            }
            const { userId, role } = (0, jwt_util_1.verifyToken)(token, env_1.default.jwt_access_secret);
            const user = yield user_model_1.default.findById(userId);
            if (!user) {
                throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
            }
            if (roles && !roles.includes(role)) {
                throw new app_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized");
            }
            req.user = { userId, role };
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
exports.default = auth;
