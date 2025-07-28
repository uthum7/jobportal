import { Application } from '../models/application.model.js';

// Get all applied jobs for a specific user
export const getAppliedJobsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const applications = await Application.find({ userId })
      .populate('jobId')
      .sort({ appliedDate: -1 });

    const response = applications.map(app => ({
      _id: app._id,
      job: app.jobId,
      appliedDate: app.appliedDate,
      status: app.status,
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applied jobs', error: error.message });
  }
};
