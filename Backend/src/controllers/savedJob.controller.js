import SavedJob from '../models/savedJob.model.js';

// Save a job
export const saveJob = async (req, res) => {
  try {
    const { jobId, userId } = req.body;
    
    // Check if job is already saved by this user
    const existingSavedJob = await SavedJob.findOne({ jobId, userId });
    
    if (existingSavedJob) {
      return res.status(400).json({ message: 'Job already saved by this user' });
    }
    
    // Create a new saved job
    const savedJob = new SavedJob({
      jobId,
      userId
    });
    
    const savedJobData = await savedJob.save();
    res.status(201).json(savedJobData);
  } catch (error) {
    res.status(500).json({ message: 'Error saving job', error: error.message });
  }
};

// Get all saved jobs for a user
export const getSavedJobsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const savedJobs = await SavedJob.find({ userId });
    res.status(200).json(savedJobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved jobs', error: error.message });
  }
};

// Delete a saved job
export const deleteSavedJob = async (req, res) => {
  try {
    const { jobId, userId } = req.body;
    
    const result = await SavedJob.findOneAndDelete({ jobId, userId });
    
    if (!result) {
      return res.status(404).json({ message: 'Saved job not found' });
    }
    
    res.status(200).json({ message: 'Saved job removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting saved job', error: error.message });
  }
};

// Check if a job is saved by a user
export const checkSavedJob = async (req, res) => {
  try {
    const { userId, jobId } = req.params;
    
    const savedJob = await SavedJob.findOne({ jobId, userId });
    
    if (savedJob) {
      res.status(200).json({ 
        isSaved: true, 
        _id: savedJob._id 
      });
    } else {
      res.status(200).json({ isSaved: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking saved job', error: error.message });
  }
};