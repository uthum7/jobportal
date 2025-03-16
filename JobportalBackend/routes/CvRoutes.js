const express = require("express");
const router = express.Router();
const UserCv = require("../models/UserCv");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");

// Save or update CV details (each step updates specific fields)
router.post(
  "/update", 
  // Validation middleware (checks 'userId', 'step', and 'data')
  [
    check('userId', 'User ID is required').notEmpty(),
    check('step', 'Step is required').notEmpty(),
    check('data', 'Data is required').notEmpty()
  ], 
  auth, // Authentication middleware (after validation)
  async (req, res) => {
    // Handle validation errors
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

      // Update only the relevant section based on the step
      switch (step) {
        case "personalInfo":
          userCv.personalInfo = data;
          break;
        case "educationDetails":
          userCv.educationDetails = data;
          break;
        case "summary":
          userCv.summary = data;
          break;
        case "professionalExperience":
          if (!Array.isArray(userCv.professionalExperience)) {
            userCv.professionalExperience = [];
          }
          userCv.professionalExperience.push(data);
          break;
        case "skill":
          if (!Array.isArray(userCv.skill)) {
            userCv.skill = [];
          }
          userCv.skill.push(data);
          break;
        case "references":
          if (!Array.isArray(userCv.references)) {
            userCv.references = [];
          }
          userCv.references.push(data);
          break;
        default:
          return res.status(400).json({ message: "Invalid step" });
      }

      await userCv.save();
      res.status(200).json({ message: "CV updated successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

// Fetch CV details for a user
router.get("/cv/:userId", auth, async (req, res) => {
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

module.exports = router;
