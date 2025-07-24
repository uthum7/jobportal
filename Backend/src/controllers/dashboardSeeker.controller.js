// backend/src/controllers/dashboardSeeker.controller.js
import { Application } from "../models/application.model.js";
import SavedJob from "../models/savedJob.model.js";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const fullName = req.user.fullName;
    const firstName = fullName.split(" ")[0];

    console.log("Fetching dashboard data for user:", userId);
    console.log("User full name:", fullName);

    // Get counts with proper error handling - using the same field name as in JobCard
    const savedJobsCount = await SavedJob.countDocuments({ userId: userId });
    const appliedJobsCount = await Application.countDocuments({ userId: userId });

    console.log("Saved jobs count:", savedJobsCount);
    console.log("Applied jobs count:", appliedJobsCount);

    const dashboardData = {
      firstName,
      savedJobsCount,
      appliedJobsCount,
    };

    console.log("Sending dashboard data:", dashboardData);

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error("Dashboard fetch error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({ 
      message: "Failed to fetch dashboard data",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};