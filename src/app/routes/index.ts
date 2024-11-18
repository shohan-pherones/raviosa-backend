import express, { Router } from "express";
import UserRoutes from "../modules/user/user.route";
import CategoryRoutes from "../modules/category/category.route";

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
