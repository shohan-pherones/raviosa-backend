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
exports.CategoryServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const app_error_1 = __importDefault(require("../../errors/app.error"));
const category_model_1 = __importDefault(require("./category.model"));
const createCategory = (categoryData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const { name } = categoryData;
        const conflicted = (yield getAllCategories()).filter((cat) => cat.name === name);
        if (conflicted.length > 0) {
            throw new app_error_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Category already exists");
        }
        const category = yield category_model_1.default.create([categoryData], {
            session,
        });
        yield session.commitTransaction();
        return category[0];
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const getSingleCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findById(categoryId).populate("products");
    if (!category) {
        throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
    }
    return category;
});
const getAllCategories = () => __awaiter(void 0, void 0, void 0, function* () {
    const categories = yield category_model_1.default.find().populate("products");
    return categories;
});
const updateCategory = (categoryId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const { name } = updateData;
        const conflicted = (yield getAllCategories()).filter((cat) => cat.name === name);
        if (conflicted.length > 0) {
            throw new app_error_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Category already exists");
        }
        const category = yield category_model_1.default.findByIdAndUpdate(categoryId, { $set: updateData }, { new: true, session }).populate("products");
        if (!category) {
            throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
        }
        yield session.commitTransaction();
        return category;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const deleteCategory = (categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findByIdAndDelete(categoryId);
    if (!category) {
        throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Category not found");
    }
});
exports.CategoryServices = {
    createCategory,
    getSingleCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
