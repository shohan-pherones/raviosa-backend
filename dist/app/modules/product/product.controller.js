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
exports.ProductControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const app_error_1 = __importDefault(require("../../errors/app.error"));
const multer_util_1 = require("../../utils/multer.util");
const product_service_1 = require("./product.service");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageFile = req.file;
        if (!imageFile) {
            throw new app_error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Image is required");
        }
        const image = yield (0, multer_util_1.uploadImage)(imageFile);
        const product = yield product_service_1.ProductServices.createProduct(Object.assign(Object.assign({}, req.body), { price: parseFloat(req.body.price), stock: parseInt(req.body.stock), image }));
        res.status(http_status_codes_1.StatusCodes.CREATED).json({
            message: "Product created successfully",
            product,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const product = yield product_service_1.ProductServices.getSingleProduct(productId);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Product retrieved successfully",
            product,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: error.message });
    }
});
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_service_1.ProductServices.getAllProducts();
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Products retrieved successfully",
            products,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
});
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const updateData = req.body;
        const product = yield product_service_1.ProductServices.updateProduct(productId, updateData);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Product updated successfully",
            product,
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: error.message });
    }
});
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        yield product_service_1.ProductServices.deleteProduct(productId);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Product deleted successfully",
        });
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: error.message });
    }
});
exports.ProductControllers = {
    createProduct,
    getSingleProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};
