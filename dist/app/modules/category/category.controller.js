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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const category_service_1 = require("./category.service");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryData = req.body;
        const category = yield category_service_1.CategoryServices.createCategory(categoryData);
        res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ message: "Category created successfully", category });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const getSingleCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const category = yield category_service_1.CategoryServices.getSingleCategory(categoryId);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: "Category retrieved successfully", category });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: error.message });
    }
});
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_service_1.CategoryServices.getAllCategories();
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: "Categories retrieved successfully", categories });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        const updateData = req.body;
        const category = yield category_service_1.CategoryServices.updateCategory(categoryId, updateData);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: "Category updated successfully", category });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: error.message });
    }
});
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        yield category_service_1.CategoryServices.deleteCategory(categoryId);
        res
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: "Category deleted successfully" });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: error.message });
    }
});
exports.CategoryControllers = {
    createCategory,
    getSingleCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
