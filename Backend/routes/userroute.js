import { Router } from "express";
import * as userController from "../controllers/user-controller.js";
import { verifyjwt } from "../middleware/auth.js";

const router = Router();

router.route("/Singup").post(userController.signup || userController.Signupuser || userController.register);
router.route("/login").post(userController.login || userController.loginuser);
router.route("/logout").post(verifyjwt, userController.logout || userController.logoutuser);
router.route("/ChangePassword").post(verifyjwt, userController.changepassword || userController.changePassword);
router.route("/UpdateInformation").post(verifyjwt, userController.updateinformation || userController.updateInformation);
router.route("/CurrentUser").get(verifyjwt, userController.getcurrentuser || userController.getCurrentUser);
router.route("/sendResetCode").post(userController.sendResetCode || userController.sendresetcode);
router.route("/resetPassword").post(userController.resetPassword || userController.resetpassword);

export default router;
