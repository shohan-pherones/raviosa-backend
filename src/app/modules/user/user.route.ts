import express, { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validation.middleware";
import { upload } from "../../utils/multer.util";
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
  auth(USER_ROLE.user, USER_ROLE.admin),
  upload.single("image"),
  validate(UserValidations.updateUserSchema),
  UserControllers.updateAnUser
);

router.put(
  "/change-role/:userId",
  auth(USER_ROLE.admin),
  validate(UserValidations.updateUserRoleSchema),
  UserControllers.changeUserRole
);

router.post(
  "/auth/register",
  upload.single("image"),
  validate(UserValidations.registerSchema),
  UserControllers.register
);

router.post(
  "/auth/login",
  validate(UserValidations.loginSchema),
  UserControllers.login
);

router.get(
  "/auth/token/refresh",
  validate(UserValidations.refreshTokenSchema),
  UserControllers.refreshToken
);

export default router;
