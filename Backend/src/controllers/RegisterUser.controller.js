import RegisterUser from '../models/RegisterUser.model.js';

// Get all counselors (case-insensitive)
export const getCounselors = async (req, res) => {
  try {
    const counselors = await RegisterUser.find({
      roles: { $elemMatch: { $regex: /^counselor$/i } }
    });
    res.status(200).json(counselors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching counselors', error });
  }
};

// Get all counselees (case-insensitive)
export const getCounselees = async (req, res) => {
  try {
    const counselees = await RegisterUser.find({
      roles: { $elemMatch: { $regex: /^counselee$/i } }
    });
    res.status(200).json(counselees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching counselees', error });
  }
};

// Get all employees (case-insensitive)
export const getEmployees = async (req, res) => {
  try {
    const employees = await RegisterUser.find({
      roles: { $elemMatch: { $regex: /^employee$/i } }
    });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};

// ✅ Get only jobseekers (case-insensitive)
export const getJobseekers = async (req, res) => {
  try {
    const jobseekers = await RegisterUser.find({
      roles: { $elemMatch: { $regex: /^jobseeker$/i } }
    });
    res.status(200).json(jobseekers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobseekers', error });
  }
};

//newli addeddddddddddddddddddddddddddd


// View single counselor by ID
export const getCounselorById = async (req, res) => {
  try {
    const counselor = await RegisterUser.findById(req.params.id);
    if (!counselor) return res.status(404).json({ message: 'Counselor not found' });
    res.status(200).json(counselor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching counselor', error });
  }
};

// Update counselor details
export const updateCounselor = async (req, res) => {
  try {
    const { name, email, roles } = req.body;
    const updatedCounselor = await RegisterUser.findByIdAndUpdate(
      req.params.id,
      { name, email, roles },
      { new: true }
    );
    res.status(200).json(updatedCounselor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating counselor', error });
  }
};

// Delete counselor
export const deleteCounselor = async (req, res) => {
  try {
    await RegisterUser.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Counselor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting counselor', error });
  }
};
