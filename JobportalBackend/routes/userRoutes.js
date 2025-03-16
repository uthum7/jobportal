import express from "express";
import { protect } from "../middleware/auth.js";
import RegisterUsers from "../models/registerUsers.js";

const router = express.Router();

router.get("/profile", protect, async (req, res) => {
  const user = await RegisterUsers.findById(req.user._id);
  res.json(user);
});

export default router;
