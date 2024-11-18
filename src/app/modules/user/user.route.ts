import express, { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { USER_ROLE } from "./user.constant";
import { UserControllers } from "./user.controller";
import { UserValidations } from "./user.validation";

const router: Router = express.Router();

router.get("/", auth(USER_ROLE.admin), UserControllers.getAllUsers);
router.get(
  "/:userId",
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.getAnUser
);
router.put(
  "/:userId",
  auth(USER_ROLE.user),
  validate(UserValidations.updateUserSchema),
  UserControllers.updateAnUser
);
router.post(
  "/register",
  validate(UserValidations.registerSchema),
  UserControllers.register
);
router.post(
  "/login",
  validate(UserValidations.loginSchema),
  UserControllers.login
);
router.post(
  "/refresh-token",
  validate(UserValidations.refreshTokenSchema),
  UserControllers.refreshToken
);

export default router;
