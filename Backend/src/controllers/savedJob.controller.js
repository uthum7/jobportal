// src/controllers/savedJob.controller.js

import SavedJob from '../models/savedJob.model.js';

// Save a job for a user (used by JobDetails page)
export const saveJob = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    // Validate required fields
    if (!jobId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'JobId and userId are required' 
      });
    }

    // Check if job is already saved by this user
    const existingSavedJob = await SavedJob.findOne({ userId, jobId });
    
    if (existingSavedJob) {
      return res.status(409).json({ 
        success: false, 
        message: 'Job already saved by this user',
        _id: existingSavedJob._id
      });
    }

    // Create new saved job entry
    const savedJob = new SavedJob({
      jobId,
      userId
    });

    const result = await savedJob.save();
    
    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      _id: result._id,
      jobId: result.jobId,
      userId: result.userId,
      createdAt: result.createdAt
    });

  } catch (error) {
    console.error('Error saving job:', error);
    
    // Handle duplicate key error (if compound index catches it)
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: 'Job already saved by this user' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while saving job' 
    });
  }
};

// Remove a saved job (used by JobDetails page)
export const deleteSavedJob = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    // Validate required fields
    if (!jobId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'JobId and userId are required' 
      });
    }

    // Find and delete the saved job
    const deletedJob = await SavedJob.findOneAndDelete({ userId, jobId });
    
    if (!deletedJob) {
      return res.status(404).json({ 
        success: false, 
        message: 'Saved job not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job removed from saved jobs successfully',
      _id: deletedJob._id
    });

  } catch (error) {
    console.error('Error removing saved job:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while removing saved job' 
    });
  }
};

// Alternative save job function (for JobCard component)
export const saveJobAlt = async (req, res) => {
  try {
    const { jobId, userId } = req.body;

    if (!jobId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'JobId and userId are required' 
      });
    }

    const existingSavedJob = await SavedJob.findOne({ userId, jobId });
    
    if (existingSavedJob) {
      return res.status(409).json({ 
        success: false, 
        message: 'Job already saved by this user' 
      });
    }

    const savedJob = new SavedJob({ jobId, userId });
    const result = await savedJob.save();
    
    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      data: result
    });

  } catch (error) {
    console.error('Error saving job (alt):', error);
    
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        message: 'Job already saved by this user' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Alternative delete saved job function (for JobCard component)
export const deleteSavedJobAlt = async (req, res) => {
  try {
    const { userId, jobId } = req.params;

    if (!jobId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'JobId and userId are required' 
      });
    }

    const deletedJob = await SavedJob.findOneAndDelete({ userId, jobId });
    
    if (!deletedJob) {
      return res.status(404).json({ 
        success: false, 
        message: 'Saved job not found' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job removed from saved jobs successfully'
    });

  } catch (error) {
    console.error('Error removing saved job (alt):', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Get all saved jobs for a specific user
export const getSavedJobsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'UserId is required' 
      });
    }

    const savedJobs = await SavedJob.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Saved jobs retrieved successfully',
      data: savedJobs,
      count: savedJobs.length
    });

  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while fetching saved jobs' 
    });
  }
};

// Check if a specific job is saved by a user
export const checkSavedJob = async (req, res) => {
  try {
    const { userId, jobId } = req.params;

    if (!jobId || !userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'JobId and userId are required' 
      });
    }

    const savedJob = await SavedJob.findOne({ userId, jobId });
    
    if (savedJob) {
      res.status(200).json({
        success: true,
        isSaved: true,
        _id: savedJob._id,
        createdAt: savedJob.createdAt
      });
    } else {
      res.status(200).json({
        success: true,
        isSaved: false
      });
    }

  } catch (error) {
    console.error('Error checking saved job status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while checking saved job status',
      isSaved: false 
    });
  }
};