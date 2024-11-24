import express, { Router } from "express";
import CategoryRoutes from "../modules/category/category.route";
import OrderRoutes from "../modules/order/order.route";
import ProductRoutes from "../modules/product/product.route";
import UserRoutes from "../modules/user/user.route";

const router: Router = express.Router();

const moduleRoutes = [
    {
        path: "/users",
        route: UserRoutes,
    },
    {
        path: "/categories",
        route: CategoryRoutes,
    },
    {
        path: "/products",
        route: ProductRoutes,
    },
    {
        path: "/orders",
        route: OrderRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
