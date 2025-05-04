import express from "express";
import {login,logout,signup} from "../controllers/auth.controller.js";
import { protectRoute}from "../middleware/auth.middleware.js";
import {  updateProfile, checkAuth } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile);//in here we use middleware
router.get("/check",protectRoute,checkAuth);


export default router;