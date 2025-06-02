import SavedJob from '../models/savedJob.model.js'; // Importing the SavedJob Mongoose model

// Save a new job
export const saveJob = async (req, res) => {
  try {
    const { jobId, userId } = req.body; // Extract jobId and userId from request body
    
    // Check if the job is already saved by this user
    const existingSavedJob = await SavedJob.findOne({ jobId, userId });
    
    if (existingSavedJob) {
      // If already saved, return error response
      return res.status(400).json({ message: 'Job already saved by this user' });
    }
    
    // Create a new SavedJob document
    const savedJob = new SavedJob({
      jobId,
      userId
    });
    
    // Save the document to the database
    const savedJobData = await savedJob.save();
    
    // Return success response with saved job data
    res.status(201).json(savedJobData);
  } catch (error) {
    // Handle and return any server error
    res.status(500).json({ message: 'Error saving job', error: error.message });
  }
};

// Get all saved jobs for a user
export const getSavedJobsByUser = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from URL parameters

    // Find all jobs saved by the user
    const savedJobs = await SavedJob.find({ userId });

    // Return saved jobs
    res.status(200).json(savedJobs);
  } catch (error) {
    // Handle and return any server error
    res.status(500).json({ message: 'Error fetching saved jobs', error: error.message });
  }
};

// Delete a saved job
export const deleteSavedJob = async (req, res) => {
  try {
    const { jobId, userId } = req.body; // Extract jobId and userId from request body
    
    // Find and delete the saved job
    const result = await SavedJob.findOneAndDelete({ jobId, userId });
    
    if (!result) {
      // If not found, return error response
      return res.status(404).json({ message: 'Saved job not found' });
    }
    
    // Return success message
    res.status(200).json({ message: 'Saved job removed successfully' });
  } catch (error) {
    // Handle and return any server error
    res.status(500).json({ message: 'Error deleting saved job', error: error.message });
  }
};

// Check if a job is saved by a user
export const checkSavedJob = async (req, res) => {
  try {
    const { userId, jobId } = req.params; // Extract userId and jobId from URL parameters
    
    // Check if a saved job exists with the given userId and jobId
    const savedJob = await SavedJob.findOne({ jobId, userId });
    
    if (savedJob) {
      // If exists, return true with job _id
      res.status(200).json({ 
        isSaved: true, 
        _id: savedJob._id 
      });
    } else {
      // If not exists, return false
      res.status(200).json({ isSaved: false });
    }
  } catch (error) {
    // Handle and return any server error
    res.status(500).json({ message: 'Error checking saved job', error: error.message });
  }
};
