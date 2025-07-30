import Counselor from "../models/counseller.model.js";

// Create a new counselor
export const createCounselor = async (req, res) => {
  try {
    const counselor = new Counselor(req.body);
    const saved = await counselor.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all counselors
export const getAllCounselors = async (req, res) => {
  try {
    const counselors = await Counselor.find();
    res.json(counselors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  createCounselor,
  getAllCounselors
};
