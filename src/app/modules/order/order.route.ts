import express, { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { USER_ROLE } from "../user/user.constant";
import { OrderControllers } from "./order.controller";
import { OrderValidations } from "./order.validation";

const router: Router = express.Router();

router.post(
  "/",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validate(OrderValidations.createOrderSchema),
  OrderControllers.createOrder
);

export default router;
