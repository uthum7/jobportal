import express from "express";
import counselorController from "../controllers/counseller.controller.js";

const counselorRouter = express.Router();

counselorRouter.post("/", counselorController.createCounselor);
counselorRouter.get("/", counselorController.getAllCounselors);

export { counselorRouter };
