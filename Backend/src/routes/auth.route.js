import express from "express";
import { protectRoute}from "../middleware/auth.middleware.js";
import {  updateProfile, checkAuth,login,logout,signup, changePassword} from "../controllers/auth.controller.js";
import { forgotPassword, resetPassword } from "../controllers/registerauth.controller.js";


const router = express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",updateProfile);//in here we use middleware
router.get("/check",checkAuth);

// Change password endpoint (protected)
router.put("/change-password", changePassword);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);



export default router;