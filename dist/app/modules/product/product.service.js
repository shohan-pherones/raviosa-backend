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
exports.ProductServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const app_error_1 = __importDefault(require("../../errors/app.error"));
const category_model_1 = __importDefault(require("../category/category.model"));
const product_model_1 = __importDefault(require("./product.model"));
const cloudinary_util_1 = require("../../utils/cloudinary.util");
const createProduct = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const { name, description, price, stock, categories, image } = productData;
        const conflicted = (yield getAllProducts()).filter((prod) => prod.name === name);
        if (conflicted.length > 0) {
            throw new app_error_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Product already exists");
        }
        const uploadResult = (yield (0, cloudinary_util_1.sendImageToCloudinary)(`products/${name}`, image));
        const product = yield product_model_1.default.create([
            {
                name,
                description,
                price,
                stock,
                categories,
                image: uploadResult.secure_url,
            },
        ], { session });
        yield category_model_1.default.updateMany({ _id: { $in: categories } }, { $push: { products: product[0]._id } }, { session });
        yield session.commitTransaction();
        return (yield product[0].populate("categories")).toObject();
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const getSingleProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(productId).populate("categories");
    if (!product) {
        throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Product not found");
    }
    return product;
});
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield product_model_1.default.find().populate("categories");
    return products;
});
const updateProduct = (productId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    try {
        session.startTransaction();
        const { name, description, price, stock, categories, image } = updateData;
        const conflicted = (yield getAllProducts()).filter((prod) => prod.name === name);
        if (conflicted.length > 0) {
            throw new app_error_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Product already exists");
        }
        const updatedProduct = yield product_model_1.default.findByIdAndUpdate(productId, {
            $set: { name, description, price, stock, categories, image },
        }, { new: true, session }).populate("categories");
        if (!updatedProduct) {
            throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Product not found");
        }
        yield session.commitTransaction();
        return updatedProduct;
    }
    catch (error) {
        yield session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
});
const deleteProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findByIdAndDelete(productId);
    if (!product) {
        throw new app_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Product not found");
    }
});
exports.ProductServices = {
    createProduct,
    getSingleProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
};
