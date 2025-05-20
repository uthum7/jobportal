import express from "express";
import { check, validationResult } from "express-validator";
import UserCv from "../models/UserCv.js";
import { protectRoute as auth } from "../middleware/registerauth.middleware.js";

const router = express.Router();

// Fetch CV details for a user
router.get("/:userId", auth, async (req, res) => {
    try {
        const userCv = await UserCv.findOne({ userId: req.params.userId });
        if (!userCv) {
            return res.status(404).json({ message: "CV not found" });
        }
        res.status(200).json(userCv);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Update a specific section of the CV
router.post(
    "/update",
    [
        check("userId", "User ID is required").notEmpty(),
        check("step", "Step is required").notEmpty(),
        check("data", "Data is required").notEmpty(),
    ],
    auth,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId, step, data } = req.body;

            let userCv = await UserCv.findOne({ userId });
            if (!userCv) {
                userCv = new UserCv({ userId });
            }

            console.log("Step:", step);
            console.log("Incoming data:", data);
            console.log("UserCv before update:", userCv);

            // Update only the relevant section based on the step
            switch (step) {
                case "personalInfo":
                    if (!data.fullname || !data.jobTitle || !data.address || !data.email || !data.phone) {
                        return res.status(400).json({ message: "Missing required fields in personalInfo" });
                    }
                    userCv.personalInfo = data;
                    break;

                case "educationDetails":
                    userCv.educationDetails = data;
                    break;

                case "summary":
                    if (typeof data !== "string") {
                        return res.status(400).json({ message: "Summary must be a string" });
                    }
                    userCv.summary = data;
                    break;

                case "professionalExperience":
                    if (!Array.isArray(data)) {
                        return res.status(400).json({ message: "Professional experience data must be an array" });
                    }

                   
                    userCv.professionalExperience = data;
                    break;

                case "skill":
                    if (!Array.isArray(data)) {
                        return res.status(400).json({ message: "Skills data must be an array" });
                    }

                    userCv.skill = data.map((skill) => ({
                        skillName: skill.skillName,
                        skillLevel: skill.skillLevel,
                    }));
                    break;

                case "references":
                    if (!Array.isArray(data)) {
                        return res.status(400).json({ message: "References data must be an array" });
                    }

                    userCv.references = data.map((ref) => ({
                        referenceName: ref.name, // Map the incoming `name` field to `referenceName`
                        position: ref.position,
                        company: ref.company,
                        contact: ref.contact,
                    }));
                    break;

                default:
                    return res.status(400).json({ message: "Invalid step" });
            }

            await userCv.save();
            res.status(200).json({ message: "CV updated successfully" });
        } catch (err) {
            if (err.name === "ValidationError") {
                console.error("Validation Error:", err.errors);
                return res.status(400).json({ message: "Validation Error", errors: err.errors });
            }
            console.error("Error updating CV:", err);
            res.status(500).json({ message: "Server Error" });
        }
    }
);

// Create a new resume
router.post("/", auth, async (req, res) => {
    try {
        const { userId } = req.body;

        let existingCv = await UserCv.findOne({ userId });
        if (existingCv) {
            return res.status(400).json({ message: "Resume already exists" });
        }

        const newCv = new UserCv({ userId });
        await newCv.save();

        res.status(201).json({ message: "Resume created successfully", cv: newCv });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});



export default router;
