import express, { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { USER_ROLE } from "../user/user.constant";
import { ProductControllers } from "./product.controller";
import { ProductValidations } from "./product.validation";
import { upload } from "../../utils/multer.util";

const router: Router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.admin),
  upload.single("image"),
  validate(ProductValidations.createProductSchema),
  ProductControllers.createProduct
);

router.get("/", ProductControllers.getAllProducts);

router.get("/:productId", ProductControllers.getSingleProduct);

router.put(
  "/:productId",
  auth(USER_ROLE.admin),
  validate(ProductValidations.updateProductSchema),
  ProductControllers.updateProduct
);

router.delete(
  "/:productId",
  auth(USER_ROLE.admin),
  ProductControllers.deleteProduct
);

export default router;
