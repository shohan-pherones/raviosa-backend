import express, { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { USER_ROLE } from "../user/user.constant";
import { CategoryControllers } from "./category.controller";
import { CategoryValidations } from "./category.validation";

const router: Router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.admin),
  validate(CategoryValidations.createCategorySchema),
  CategoryControllers.createCategory
);
router.get("/", CategoryControllers.getAllCategories);
router.get("/:categoryId", CategoryControllers.getSingleCategory);
router.put(
  "/:categoryId",
  auth(USER_ROLE.admin),
  validate(CategoryValidations.createCategorySchema),
  CategoryControllers.updateCategory
);
router.delete(
  "/:categoryId",
  auth(USER_ROLE.admin),
  CategoryControllers.deleteCategory
);

export default router;
