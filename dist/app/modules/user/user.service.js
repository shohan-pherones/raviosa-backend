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
exports.UserServices = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const env_1 = __importDefault(require("../../config/env"));
const app_error_1 = __importDefault(require("../../errors/app.error"));
const jwt_util_1 = require("../../utils/jwt.util");
const user_model_1 = __importDefault(require("./user.model"));
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.default.findOne({ email: userData.email });
    if (existingUser) {
        throw new app_error_1.default(http_status_codes_1.StatusCodes.CONFLICT, "User with this email already exists");
    }
    const hashedPassword = yield bcrypt_1.default.hash(userData.password, 12);
    const user = new user_model_1.default(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
    yield user.save();
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, jwt_util_1.createToken)(jwtPayload, env_1.default.jwt_access_secret, env_1.default.jwt_access_expires_in);
    const refreshToken = (0, jwt_util_1.createToken)(jwtPayload, env_1.default.jwt_refresh_secret, env_1.default.jwt_refresh_expires_in);
    return { accessToken, refreshToken, user };
});
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User with this email does not exist");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new app_error_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Incorrect password");
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, jwt_util_1.createToken)(jwtPayload, env_1.default.jwt_access_secret, env_1.default.jwt_access_expires_in);
    const refreshToken = (0, jwt_util_1.createToken)(jwtPayload, env_1.default.jwt_refresh_secret, env_1.default.jwt_refresh_expires_in);
    return { accessToken, refreshToken, user };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = (0, jwt_util_1.verifyToken)(token, env_1.default.jwt_refresh_secret);
        if (!userId) {
            throw new app_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid token payload");
        }
        const user = yield user_model_1.default.findById(userId);
        if (!user) {
            throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        const jwtPayload = {
            userId: user.id,
            role: user.role,
        };
        const accessToken = (0, jwt_util_1.createToken)(jwtPayload, env_1.default.jwt_access_secret, env_1.default.jwt_access_expires_in);
        return { accessToken, user };
    }
    catch (error) {
        if (error instanceof app_error_1.default) {
            throw error;
        }
        throw new app_error_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Something went wrong during token refresh");
    }
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find();
    if (!users) {
        throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No user found");
    }
    return users;
});
const getAnUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    return user;
});
const updateAnUser = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findByIdAndUpdate(userId, { $set: userData }, { new: true });
    if (!user) {
        throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, jwt_util_1.createToken)(jwtPayload, env_1.default.jwt_access_secret, env_1.default.jwt_access_expires_in);
    const refreshToken = (0, jwt_util_1.createToken)(jwtPayload, env_1.default.jwt_refresh_secret, env_1.default.jwt_refresh_expires_in);
    return { accessToken, refreshToken, user };
});
exports.UserServices = {
    register,
    login,
    refreshToken,
    getAllUsers,
    getAnUser,
    updateAnUser,
};
