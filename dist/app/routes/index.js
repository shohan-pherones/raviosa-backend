"use strict";
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_route_1 = __importDefault(
    require("../modules/category/category.route")
);
const order_route_1 = __importDefault(require("../modules/order/order.route"));
const product_route_1 = __importDefault(
    require("../modules/product/product.route")
);
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_1.default,
    },
    {
        path: "/categories",
        route: category_route_1.default,
    },
    {
        path: "/products",
        route: product_route_1.default,
    },
    {
        path: "/orders",
        route: order_route_1.default,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
