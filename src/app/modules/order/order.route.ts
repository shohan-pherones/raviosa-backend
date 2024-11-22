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

router.get(
  "/preview-order",
  auth(USER_ROLE.user, USER_ROLE.admin),
  OrderControllers.getSingleOrderForConfirm
);

router.put(
  "/confirm-order/:orderId",
  auth(USER_ROLE.user, USER_ROLE.admin),
  validate(OrderValidations.confirmOrderSchema),
  OrderControllers.confirmOrder
);

export default router;
