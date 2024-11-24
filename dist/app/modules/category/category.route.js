"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const user_constant_1 = require("../user/user.constant");
const category_controller_1 = require("./category.controller");
const category_validation_1 = require("./category.validation");
const router = express_1.default.Router();
router.post("/", (0, auth_middleware_1.default)(user_constant_1.USER_ROLE.admin), (0, validation_middleware_1.validate)(category_validation_1.CategoryValidations.createCategorySchema), category_controller_1.CategoryControllers.createCategory);
router.get("/", category_controller_1.CategoryControllers.getAllCategories);
router.get("/:categoryId", category_controller_1.CategoryControllers.getSingleCategory);
router.put("/:categoryId", (0, auth_middleware_1.default)(user_constant_1.USER_ROLE.admin), (0, validation_middleware_1.validate)(category_validation_1.CategoryValidations.createCategorySchema), category_controller_1.CategoryControllers.updateCategory);
router.delete("/:categoryId", (0, auth_middleware_1.default)(user_constant_1.USER_ROLE.admin), category_controller_1.CategoryControllers.deleteCategory);
exports.default = router;
