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
const order_controller_1 = require("./order.controller");
const order_validation_1 = require("./order.validation");
const router = express_1.default.Router();
router.post(
    "/",
    (0, auth_middleware_1.default)(
        user_constant_1.USER_ROLE.user,
        user_constant_1.USER_ROLE.admin
    ),
    (0, validation_middleware_1.validate)(
        order_validation_1.OrderValidations.createOrderSchema
    ),
    order_controller_1.OrderControllers.createOrder
);
router.get(
    "/preview-order",
    (0, auth_middleware_1.default)(
        user_constant_1.USER_ROLE.user,
        user_constant_1.USER_ROLE.admin
    ),
    order_controller_1.OrderControllers.getSingleOrderForConfirm
);
router.put(
    "/confirm-order/:orderId",
    (0, auth_middleware_1.default)(
        user_constant_1.USER_ROLE.user,
        user_constant_1.USER_ROLE.admin
    ),
    (0, validation_middleware_1.validate)(
        order_validation_1.OrderValidations.confirmOrderSchema
    ),
    order_controller_1.OrderControllers.confirmOrder
);
router.get(
    "/my-orders",
    (0, auth_middleware_1.default)(
        user_constant_1.USER_ROLE.user,
        user_constant_1.USER_ROLE.admin
    ),
    order_controller_1.OrderControllers.getOrdersByUserId
);
router.get(
    "/all-orders",
    (0, auth_middleware_1.default)(user_constant_1.USER_ROLE.admin),
    order_controller_1.OrderControllers.getAllOrders
);
router.put(
    "/manage/:status/:orderId",
    (0, auth_middleware_1.default)(user_constant_1.USER_ROLE.admin),
    order_controller_1.OrderControllers.mutateOrderStatus
);
router.get(
    "/order-details/:orderId",
    (0, auth_middleware_1.default)(
        user_constant_1.USER_ROLE.user,
        user_constant_1.USER_ROLE.admin
    ),
    order_controller_1.OrderControllers.getOrderDetailsByOrderId
);
exports.default = router;
