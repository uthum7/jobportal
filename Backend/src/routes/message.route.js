import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
<<<<<<< HEAD
import {getMessages,getUserForSidebar,sendMessage} from  "../controllers/message.controllers.js";
=======
import {getMessages,getUserForSidebar,sendMessage,deleteMessage} from  "../controllers/message.controllers.js";
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19

const router = express.Router();


router.get("/users",protectRoute,  getUserForSidebar);
router.get("/:id",protectRoute, getMessages);

router.post("/send/:id", protectRoute,sendMessage);
<<<<<<< HEAD
=======
router.delete("/delete/:messageId", protectRoute, deleteMessage);

>>>>>>> c1587ed030af74a541137562c0abe076b06bda19

export default router;