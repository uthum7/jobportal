<<<<<<< HEAD
import express from "express";
import { protectRoute}from "../middleware/auth.middleware.js";
import {  updateProfile, checkAuth,login,logout,signup, changePassword} from "../controllers/auth.controller.js";
=======
//route file for the authentication 

import express from "express";
import { protectRoute}from "../middleware/auth.middleware.js";
import {  updateProfile, checkAuth,login,logout,signup} from "../controllers/auth.controller.js";
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
import { forgotPassword, resetPassword } from "../controllers/registerauth.controller.js";


const router = express.Router();

<<<<<<< HEAD
router.post("/signup",signup);
=======
router.post("/signup",signup);//in here founctions build up in controllers
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19

router.post("/login",login);

router.post("/logout",logout);

<<<<<<< HEAD
router.put("/update-profile",updateProfile);//in here we use middleware
router.get("/check",checkAuth);

// Change password endpoint (protected)
router.put("/change-password", changePassword);
=======
router.put("/update-profile",protectRoute,updateProfile);//in here we use middleware
router.get("/check",protectRoute,checkAuth);
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);



export default router;