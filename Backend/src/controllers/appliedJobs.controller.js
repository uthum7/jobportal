import { Application } from '../models/application.model.js';

import Job from "../models/Job.model.js";
import mongoose from 'mongoose';


// Get all applied jobs for a specific user
export const getAppliedJobsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("getAppliedJobsByUser called with userId:", userId);
    console.log("userId type:", typeof userId);
    
    // Check if there are any applications in the database at all
    const allApplications = await Application.find({});
    console.log("Total applications in database:", allApplications.length);
    console.log("Sample applications:", allApplications.slice(0, 3).map(app => ({
      id: app._id,
      userId: app.userId,
      userIdType: typeof app.userId,
      jobId: app.jobId
    })));

    const applications = await Application.find({ userId })
      .populate('jobId')
      .sort({ appliedDate: -1 });

    console.log("Applications found for userId:", userId, "count:", applications.length);
    console.log("Found applications:", applications.map(app => ({
      id: app._id,
      userId: app.userId,
      jobId: app.jobId?._id
    })));

    const response = applications.map(app => ({
      _id: app._id,
      job: app.jobId,
      appliedDate: app.appliedDate,
      status: app.status,
    }));

    console.log("Sending response:", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getAppliedJobsByUser:", error);
    res.status(500).json({ message: 'Error fetching applied jobs', error: error.message });
  }
};
