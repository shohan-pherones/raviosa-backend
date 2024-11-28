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
exports.UserControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = __importDefault(require("../../errors/app.error"));
const user_service_1 = require("./user.service");
const multer_util_1 = require("../../utils/multer.util");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFile = req.file;
        if (!imageFile) {
            throw new app_error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Image is required");
        }
        const image = yield (0, multer_util_1.uploadImage)(imageFile);
        const { accessToken, refreshToken, user } = yield user_service_1.UserServices.register(Object.assign(Object.assign({}, req.body), { image }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            message: "User registered successfully",
            accessToken,
            refreshToken,
            user,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = yield user_service_1.UserServices.login(email, password);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "User logged in successfully",
            accessToken,
            refreshToken,
            user,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.headers["x-refresh-token"];
        const { accessToken, user } = yield user_service_1.UserServices.refreshToken(refreshToken);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Access token retrieved successfully",
            accessToken,
            refreshToken,
            user,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_service_1.UserServices.getAllUsers();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Users retrieved successfully",
            users,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const getAnUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield user_service_1.UserServices.getAnUser(userId);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "User retrieved successfully",
            user,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const updateAnUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { userId: loggedInUserId } = req.user;
        if (userId !== loggedInUserId) {
            throw new app_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized to update this user");
        }
        let updatedData = Object.assign({}, req.body);
        const imageFile = req.file;
        if (imageFile) {
            const image = yield (0, multer_util_1.uploadImage)(imageFile);
            updatedData = Object.assign(Object.assign({}, updatedData), { image });
        }
        const { accessToken, refreshToken, user } = yield user_service_1.UserServices.updateAnUser(userId, updatedData);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "User updated successfully",
            accessToken,
            refreshToken,
            user,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
exports.UserControllers = {
    register,
    login,
    refreshToken,
    getAllUsers,
    getAnUser,
    updateAnUser,
};
