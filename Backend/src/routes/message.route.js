import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {getMessages,getUserForSidebar,sendMessage,deleteMessage} from  "../controllers/message.controllers.js";

const router = express.Router();


router.get("/users",protectRoute,  getUserForSidebar);
router.get("/:id",protectRoute, getMessages);

router.post("/send/:id", protectRoute,sendMessage);
router.delete("/delete/:messageId", protectRoute, deleteMessage);


export default router;