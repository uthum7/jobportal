// routes/cv.routes.js
import express from "express";
import { check, validationResult } from "express-validator";
import UserCv from "../models/UserCv.js";
import { protectRoute as auth } from "../middleware/registerauth.middleware.js";

const router = express.Router();

// GET /api/cv - Fetch authenticated user's CV details
router.get("/", auth, async (req, res) => {
    // ✅ FIX: String with a variable must use a template literal (backticks)
    console.log(`[CV Route - GET /] Request received for user ID: ${req.user?._id}`);
    try {
        const authenticatedUserId = req.user._id;

        let userCv = await UserCv.findOne({ userId: authenticatedUserId });
        
        if (!userCv) {
            // ✅ FIX: String with a variable must use a template literal (backticks)
            console.log(`[CV Route - GET /] No CV found for user ${authenticatedUserId}. Returning initial template.`);
            const initialCvData = new UserCv({ userId: authenticatedUserId }).toObject();
            
            // Clean up default Mongoose fields for a clean frontend state
            delete initialCvData._id;
            delete initialCvData.__v;
            if (initialCvData.personalInfo && initialCvData.personalInfo._id !== undefined) delete initialCvData.personalInfo._id;
            if (initialCvData.educationDetails && initialCvData.educationDetails._id !== undefined) delete initialCvData.educationDetails._id;

            return res.status(200).json({
                ...initialCvData,
                _isNewCvTemplate: true 
            });
        }
        // ✅ FIX: String with a variable must use a template literal (backticks)
        console.log(`[CV Route - GET /] CV found for user ${authenticatedUserId}.`);
        res.status(200).json(userCv);
    } catch (error) {
        // ✅ FIX: String with variables must use a template literal (backticks)
        console.error(`[CV Route - GET /] Error fetching CV for user ${req.user?._id}: ${error.message}`, error.stack);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Server error while fetching CV data.' });
        }
    }
});

// POST /api/cv/update - Update/Create a specific section of the authenticated user's CV
router.post(
    "/update",
    [
        auth,
        check("step", "Step (CV section name) is required").notEmpty().isString(),
        check("data", "Data for the step is required").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.warn("[CV Route - POST /update] Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const authenticatedUserId = req.user._id;
        const { step, data } = req.body;
        // ✅ FIX: String with variables must use a template literal (backticks)
        console.log(`[CV Route - POST /update] Request received for user ID: ${authenticatedUserId}, Step: "${step}"`);

        try {
            let userCv = await UserCv.findOne({ userId: authenticatedUserId });

            if (!userCv) {
                // ✅ FIX: String with a variable must use a template literal (backticks)
                console.log(`[CV Route - POST /update] No CV found for user ${authenticatedUserId}. Creating new CV document.`);
                userCv = new UserCv({ userId: authenticatedUserId });
            }

            if (userCv.schema.paths[step]) {
                if (typeof userCv[step] === 'object' && userCv[step] !== null && !Array.isArray(userCv[step])) {
                    userCv[step] = { ...userCv[step].toObject(), ...data };
                } else {
                    userCv[step] = data;
                }
            } else {
                // ✅ FIX: String with variables must use a template literal (backticks)
                console.warn(`[CV Route - POST /update] Invalid step: "${step}" for user ${authenticatedUserId}.`);
                return res.status(400).json({ message: "Invalid CV section specified." });
            }
            
            await userCv.save();
            // ✅ FIX: String with variables must use a template literal (backticks)
            console.log(`[CV Route - POST /update] CV successfully updated for user ${authenticatedUserId}, Step: "${step}".`);
            res.status(200).json(userCv);

        } catch (err) {
            if (err.name === "ValidationError") {
                // ✅ FIX: String with variables must use a template literal (backticks)
                console.error(`[CV Route - POST /update] Validation Error for user ${authenticatedUserId}, step ${step}:`, err.errors);
                return res.status(400).json({ message: "Validation Error", errors: err.errors });
            }
            // ✅ FIX: String with variables must use a template literal (backticks)
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
    // ✅ FIX: String with a variable must use a template literal (backticks)
    console.log(`[CV Route - POST /] Request received to create CV for user ID: ${authenticatedUserId}`);
    try {
        let existingCv = await UserCv.findOne({ userId: authenticatedUserId });
        if (existingCv) {
            // ✅ FIX: String with a variable must use a template literal (backticks)
            console.warn(`[CV Route - POST /] CV already exists for user ${authenticatedUserId}.`);
            return res.status(400).json({ message: "Resume already exists for this user. Use the /update endpoint." });
        }

        const newCv = new UserCv({ userId: authenticatedUserId });
        await newCv.save();
        // ✅ FIX: String with a variable must use a template literal (backticks)
        console.log(`[CV Route - POST /] New CV created for user ${authenticatedUserId}.`);
        res.status(201).json(newCv);

    } catch (err) {
        // ✅ FIX: String with variables must use a template literal (backticks)
        console.error(`[CV Route - POST /] Error creating new CV for user ${authenticatedUserId}: ${err.message}`, err.stack);
        if (err.code === 11000) {
            return res.status(400).json({ message: "Resume already exists for this user (db constraint)." });
        }
        if (!res.headersSent) {
            res.status(500).json({ message: "Server Error while creating CV." });
        }
    }
});

export default router;