import express from "express";
import { protectRoute}from "../middleware/auth.middleware.js";
import {  updateProfile, checkAuth,login,logout,signup} from "../controllers/auth.controller.js";
import { forgotPassword, resetPassword } from "../controllers/registerauth.controller.js";


const router = express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile);//in here we use middleware
router.get("/check",protectRoute,checkAuth);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);



export default router;