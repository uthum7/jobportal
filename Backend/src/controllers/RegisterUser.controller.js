import RegisterUser from '../models/RegisterUser.model.js';
import Job from "../models/job.model.js";
import Booking from '../models/bookings.js';

import { Application } from '../models/application.model.js';
import mongoose from 'mongoose';  // or import { Types } from 'mongoose';

// ------------------ GET ALL USERS BY ROLE ------------------

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

// ------------------ VIEW SINGLE USER BY ROLE ------------------

export const getCounselorById = async (req, res) => {
  try {
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'counselor')) {
      return res.status(404).json({ message: 'Counselor not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching counselor', error });
  }
};

export const getCounseleeById = async (req, res) => {
  try {
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'counselee')) {
      return res.status(404).json({ message: 'Counselee not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching counselee', error });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'employee')) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error });
  }
};

export const getJobseekerById = async (req, res) => {
  try {
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'jobseeker')) {
      return res.status(404).json({ message: 'Jobseeker not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobseeker', error });
  }
};

// ------------------ UPDATE USER BY ROLE ------------------

export const updateCounselor = async (req, res) => {
  try {
    const { name, email, roles } = req.body;
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'counselor')) {
      return res.status(404).json({ message: 'Counselor not found' });
    }

    user.name = name;
    user.email = email;
    user.roles = roles;

    const updated = await user.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating counselor', error });
  }
};

export const updateCounselee = async (req, res) => {
  try {
    const { name, email, roles } = req.body;
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'counselee')) {
      return res.status(404).json({ message: 'Counselee not found' });
    }

    user.name = name;
    user.email = email;
    user.roles = roles;

    const updated = await user.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating counselee', error });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { name, email, roles } = req.body;
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'employee')) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    user.name = name;
    user.email = email;
    user.roles = roles;

    const updated = await user.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error });
  }
};

export const updateJobseeker = async (req, res) => {
  try {
    const { name, email, roles } = req.body;
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'jobseeker')) {
      return res.status(404).json({ message: 'Jobseeker not found' });
    }

    user.name = name;
    user.email = email;
    user.roles = roles;

    const updated = await user.save();
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating jobseeker', error });
  }
};

// ------------------ DELETE USER BY ROLE ------------------

export const deleteCounselor = async (req, res) => {
  try {
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'counselor')) {
      return res.status(404).json({ message: 'Counselor not found' });
    }

    await RegisterUser.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Counselor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting counselor', error });
  }
};

export const deleteCounselee = async (req, res) => {
  try {
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'counselee')) {
      return res.status(404).json({ message: 'Counselee not found' });
    }

    await RegisterUser.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Counselee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting counselee', error });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'employee')) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await RegisterUser.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error });
  }
};

export const deleteJobseeker = async (req, res) => {
  try {
    const user = await RegisterUser.findById(req.params.id);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'jobseeker')) {
      return res.status(404).json({ message: 'Jobseeker not found' });
    }

    await RegisterUser.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Jobseeker deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting jobseeker', error });
  }
};

// ------------------ GET RECENT JOBS WITH APPLICATION COUNTS ------------------

export const getRecentJobsByEmployee = async (req, res) => {
  const { PostedBy } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(PostedBy)) {
      return res.status(400).json({ message: "Invalid PostedBy ID" });
    }

    const postedById = new mongoose.Types.ObjectId(PostedBy);

    // Get recent jobs and convert to plain objects
    const recentJobs = await Job.find({ PostedBy: postedById })
      .sort({ postedDate: -1 })
      
      .lean();

    const jobIds = recentJobs.map(job => job._id);

    // Aggregate application counts per job
    const counts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } }
    ]);

    // Map jobId to count
    const countMap = {};
    counts.forEach(c => {
      countMap[c._id.toString()] = c.count;
    });

    // Current date to compare with deadlines
    const now = new Date();

    // Attach application counts and isActive flag to each job
    const jobsWithApplications = recentJobs.map(job => {
      // Check if JobDeadline is in the future
      const deadlineDate = new Date(job.JobDeadline);
      const isActive = deadlineDate > now;

      return {
        ...job,
        applications: countMap[job._id.toString()] || 0,
        isActive
      };
    });

    res.status(200).json(jobsWithApplications);
  } catch (error) {
    console.error("Error in getRecentJobsByEmployee:", error);
    res.status(500).json({ message: "Failed to fetch recent jobs", error: error.message });
  }
};

// ------------------ GET TOTAL APPLICATION COUNT FOR EMPLOYEE ------------------

export const getApplicationCountByEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employeeObjectId = new mongoose.Types.ObjectId(id);

    const jobs = await Job.find({ PostedBy: employeeObjectId }, { _id: 1 });
    const jobIds = jobs.map(job => job._id);

    if (jobIds.length === 0) {
      return res.status(200).json({ count: 0 });
    }

    const applicationCount = await Application.countDocuments({
      jobId: { $in: jobIds }
    });

    return res.status(200).json({ count: applicationCount });
  } catch (error) {
    console.error('Error fetching application count:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// implementing  controller for view all jobs 
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate("PostedBy", "name role avatar")
      .lean();

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Calculate days left
    const today = new Date();
    const deadline = new Date(job.JobDeadline);
    job.daysLeft = Math.max(0, Math.ceil((deadline - today) / (1000 * 60 * 60 * 24)));

    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// ------------------ UPDATE JOB DEADLINE AND POST OWNER ------------------

export const updateJobDetails = async (req, res) => {
  try {
    const { id } = req.params; // Job ID
    const { JobDeadline, PostedBy } = req.body;

    // Validate JobDeadline
    if (!JobDeadline || isNaN(Date.parse(JobDeadline))) {
      return res.status(400).json({ message: 'Invalid or missing JobDeadline' });
    }

    // Validate PostedBy (must be a valid ObjectId and belong to an employee)
    if (!mongoose.Types.ObjectId.isValid(PostedBy)) {
      return res.status(400).json({ message: 'Invalid PostedBy ID' });
    }

    const user = await RegisterUser.findById(PostedBy);
    if (!user || !user.roles.some(role => role.toLowerCase() === 'employee')) {
      return res.status(400).json({ message: 'PostedBy must be a valid employee' });
    }

    // Update the job
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      {
        JobDeadline: new Date(JobDeadline),
        PostedBy
      },
      { new: true }
    ).populate('PostedBy', 'name email');

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({
      message: 'Job updated successfully',
      job: updatedJob
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// controllers/bookingController.js

export const getRecentBookingsForCounselor = async (req, res) => {
  const { counselorId } = req.params;

  try {
    const bookings = await Booking.find({
      counselor_id: counselorId,
      deleted_at: null // Ensure only active bookings
    })
      .populate('user_id', 'username') // Only get username of counselee
      .sort({ createdAt: -1 }) // Most recent first
      

    const formatted = bookings.map((booking) => ({
      _id: booking._id,
      sessionType: booking.topic,
      clientName: booking.user_id?.username || 'Unknown',
      bookingDate: booking.createdAt,
      status: booking.status?.toLowerCase() || 'pending',
      time: booking.time || null
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching recent bookings:', err);
    res.status(500).json({ message: 'Failed to fetch recent bookings', error: err.message });
  }
};
