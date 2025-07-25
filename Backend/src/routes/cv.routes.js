// routes/cv.routes.js
import express from "express";
import { check, validationResult } from "express-validator";
import UserCv from "../models/UserCv.js";
import { protectRoute as auth } from "../middleware/registerauth.middleware.js";

const router = express.Router();

// GET /api/cv - Fetch authenticated user's CV details
router.get("/", auth, async (req, res) => {
    console.log(`[CV Route - GET /] Request received for user ID: ${req.user?._id}`);
    try {
        const authenticatedUserId = req.user._id; // ID from validated token (ensured by auth middleware)

        let userCv = await UserCv.findOne({ userId: authenticatedUserId });
        
        if (!userCv) {
            console.log(`[CV Route - GET /] No CV found for user ${authenticatedUserId}. Returning initial template.`);
            const initialCvData = new UserCv({ userId: authenticatedUserId }).toObject();
            
            delete initialCvData._id; // Mongoose might add _id even to new unsaved object
            delete initialCvData.__v;
            if (initialCvData.personalInfo && initialCvData.personalInfo._id !== undefined) delete initialCvData.personalInfo._id;
            if (initialCvData.educationDetails && initialCvData.educationDetails._id !== undefined) delete initialCvData.educationDetails._id;
            // Repeat for other subdocuments if they have _id by default and you don't want them

            return res.status(200).json({
                ...initialCvData,
                _isNewCvTemplate: true 
            });
        }
        console.log(`[CV Route - GET /] CV found for user ${authenticatedUserId}.`);
        res.status(200).json(userCv);
    } catch (error) {
        console.error(`[CV Route - GET /] Error fetching CV for user ${req.user?._id}: ${error.message}`, error.stack);
        // Ensure a JSON response even for unexpected errors
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error while fetching CV data.' });
        }
    }
});

// POST /api/cv/update - Update/Create a specific section of the authenticated user's CV
router.post(
    "/update",
    [
        auth, // Place auth middleware first
        check("step", "Step (CV section name) is required").notEmpty().isString(),
        check("data", "Data for the step is required").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.warn("[CV Route - POST /update] Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const authenticatedUserId = req.user._id; // From auth middleware
        const { step, data } = req.body;
        console.log(`[CV Route - POST /update] Request received for user ID: ${authenticatedUserId}, Step: "${step}"`);

        try {
            let userCv = await UserCv.findOne({ userId: authenticatedUserId });

            if (!userCv) {
                console.log(`[CV Route - POST /update] No CV found for user ${authenticatedUserId}. Creating new CV document.`);
                userCv = new UserCv({ userId: authenticatedUserId });
            }

            if (userCv.schema.paths[step]) {
                if (typeof userCv[step] === 'object' && userCv[step] !== null && !Array.isArray(userCv[step])) {
                    // Merge for object subdocuments to preserve other fields if `data` is partial
                    userCv[step] = { ...userCv[step].toObject(), ...data };
                } else {
                    // Replace for arrays or simple types
                    userCv[step] = data;
                }
            } else {
                console.warn(`[CV Route - POST /update] Invalid step: "${step}" for user ${authenticatedUserId}.`);
                return res.status(400).json({ message: "Invalid CV section specified." });
            }
            
            await userCv.save();
            console.log(`[CV Route - POST /update] CV successfully updated for user ${authenticatedUserId}, Step: "${step}".`);
            res.status(200).json(userCv); // Return the full updated CV document

        } catch (err) {
            if (err.name === "ValidationError") {
                console.error(`[CV Route - POST /update] Validation Error for user ${authenticatedUserId}, step ${step}:`, err.errors);
                return res.status(400).json({ message: "Validation Error", errors: err.errors });
            }
            console.error(`[CV Route - POST /update] Error updating CV for user ${authenticatedUserId}, step ${step}: ${err.message}`, err.stack);
            if (!res.headersSent) {
                res.status(500).json({ message: "Server error while updating CV." });
            }
        }
    }
);

// POST /api/cv - Create a new resume (Potentially redundant if /update handles creation)
router.post("/", auth, async (req, res) => {
    const authenticatedUserId = req.user._id;
    console.log(`[CV Route - POST /] Request received to create CV for user ID: ${authenticatedUserId}`);
    try {
        let existingCv = await UserCv.findOne({ userId: authenticatedUserId });
        if (existingCv) {
            console.warn(`[CV Route - POST /] CV already exists for user ${authenticatedUserId}.`);
            return res.status(400).json({ message: "Resume already exists for this user. Use the /update endpoint." });
        }

        const newCv = new UserCv({ userId: authenticatedUserId }); // Schema defaults will apply
        await newCv.save();
        console.log(`[CV Route - POST /] New CV created for user ${authenticatedUserId}.`);
        res.status(201).json(newCv);

    } catch (err) {
        console.error(`[CV Route - POST /] Error creating new CV for user ${authenticatedUserId}: ${err.message}`, err.stack);
        if (err.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: "Resume already exists for this user (db constraint)." });
        }
        if (!res.headersSent) {
            res.status(500).json({ message: "Server Error while creating CV." });
        }
    }
});

export default router;