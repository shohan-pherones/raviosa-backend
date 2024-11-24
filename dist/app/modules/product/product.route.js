"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(
    require("../../middlewares/auth.middleware")
);
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const user_constant_1 = require("../user/user.constant");
const product_controller_1 = require("./product.controller");
const product_validation_1 = require("./product.validation");
const router = express_1.default.Router();
router.post(
    "/",
    (0, auth_middleware_1.default)(user_constant_1.USER_ROLE.admin),
    (0, validation_middleware_1.validate)(
        product_validation_1.ProductValidations.createProductSchema
    ),
    product_controller_1.ProductControllers.createProduct
);
router.get("/", product_controller_1.ProductControllers.getAllProducts);
router.get(
    "/:productId",
    product_controller_1.ProductControllers.getSingleProduct
);
router.put(
    "/:productId",
    (0, auth_middleware_1.default)(user_constant_1.USER_ROLE.admin),
    (0, validation_middleware_1.validate)(
        product_validation_1.ProductValidations.updateProductSchema
    ),
    product_controller_1.ProductControllers.updateProduct
);
router.delete(
    "/:productId",
    (0, auth_middleware_1.default)(user_constant_1.USER_ROLE.admin),
    product_controller_1.ProductControllers.deleteProduct
);
exports.default = router;
