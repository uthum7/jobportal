//backend/src/controllers/application.controller.js
import { Application } from "../models/application.model.js";
import crypto from 'crypto';

// Encryption utilities for sensitive data
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-character-secret-key-here'; // Use environment variable in production
const ALGORITHM = 'aes-256-cbc';

const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY.slice(0, 32), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Return original text if encryption fails
  }
};

const decrypt = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  try {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY.slice(0, 32), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText; // Return original text if decryption fails
  }
};


// Helper function to encrypt sensitive fields
const encryptSensitiveData = (applicationData) => {
  const sensitiveFields = ['nic', 'phoneNumber', 'address'];
  const encryptedData = { ...applicationData };
  
  sensitiveFields.forEach(field => {
    if (encryptedData[field]) {
      encryptedData[field] = encrypt(encryptedData[field]);
    }
  });
  
  return encryptedData;
};

// Helper function to decrypt sensitive fields
const decryptSensitiveData = (applicationData) => {
  const sensitiveFields = ['nic', 'phoneNumber', 'address'];
  const decryptedData = { ...applicationData };
  
  sensitiveFields.forEach(field => {
    if (decryptedData[field]) {
      decryptedData[field] = decrypt(decryptedData[field]);
    }
  });
  
  return decryptedData;
};

// Check if user has already applied for a job
export const checkApplicationStatus = async (req, res) => {
  try {
    const { userId, jobId } = req.params;
    const application = await Application.findOne({ userId, jobId });
    
    res.status(200).json({ hasApplied: !!application });
  } catch (error) {
    res.status(500).json({ error: "Error checking application status", details: error.message });
  }
};

// Submit job application
export const submitApplication = async (req, res) => {
  try {
    const { jobId, userId, applicationData } = req.body;
    
    // Validate required fields
    if (!jobId || !userId || !applicationData) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Check if user has already applied
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied for this job" });
    }
    
    // Additional validation
    const requiredFields = ['fullName', 'nic', 'email', 'phoneNumber', 'address', 'birthday', 'gender'];
    const missingFields = requiredFields.filter(field => !applicationData[field] || !applicationData[field].trim());
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: "Missing required fields", 
        missingFields 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    
    // Validate NIC format
    const nicRegex = /^(\d{12}|\d{9}[VXvx])$/;
    if (!nicRegex.test(applicationData.nic)) {
      return res.status(400).json({ error: "Invalid NIC format" });
    }
    
    // Validate phone number format
    const phoneRegex = /^(0\d{9}|\+94\d{9})$/;
    if (!phoneRegex.test(applicationData.phoneNumber)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    // Validate birthday
const birthday = new Date(applicationData.birthday);
const today = new Date();
if (birthday >= today) {
    return res.status(400).json({ error: "Invalid birthday - cannot be today or in the future" });
}

// Validate gender
const validGenders = ['male', 'female', 'other', 'prefer-not-to-say'];
if (!validGenders.includes(applicationData.gender)) {
    return res.status(400).json({ error: "Invalid gender value" });
}
    
    // Validate skills
    if (!applicationData.skills || applicationData.skills.length === 0) {
      return res.status(400).json({ error: "At least one skill is required" });
    }
    
    // Validate education
    if (!applicationData.education || applicationData.education.length === 0) {
      return res.status(400).json({ error: "At least one education entry is required" });
    }
    
    // Encrypt sensitive data before storing
    const encryptedApplicationData = applicationData;
    
    const application = new Application({
      jobId,
      userId,
      applicationData: encryptedApplicationData,
      appliedDate: new Date(),
      status: 'pending'
    });
    
    await application.save();
    
    res.status(201).json({ 
      message: "Application submitted successfully", 
      applicationId: application._id 
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: "Error submitting application", details: error.message });
  }
};

// Get a specific application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id).populate('jobId');
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    // Decrypt sensitive data before sending
    const decryptedApplication = {
      ...application.toObject(),
      applicationData: decryptSensitiveData(application.applicationData)
    };
    
    res.status(200).json(decryptedApplication);
  } catch (error) {
    res.status(500).json({ error: "Error fetching application", details: error.message });
  }
};

// Get all applications by a specific user
export const getApplicationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { userId };
    if (status) query.status = status;
    
    const applications = await Application.find(query)
      .populate('jobId')
      .sort({ appliedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Application.countDocuments(query);
    
    // Decrypt sensitive data for each application
    const decryptedApplications = applications.map(app => ({
      ...app.toObject(),
      applicationData: decryptSensitiveData(app.applicationData)
    }));
    
    res.status(200).json({
      applications: decryptedApplications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user applications", details: error.message });
  }
};

// Get all applications for a specific job (for employers)
export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { jobId };
    if (status) query.status = status;
    
    const applications = await Application.find(query)
      .sort({ appliedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Application.countDocuments(query);
    
    // For employers, return limited sensitive data (e.g., masked NIC, phone)
    const sanitizedApplications = applications.map(app => {
      const decryptedData = decryptSensitiveData(app.applicationData);
      return {
        ...app.toObject(),
        applicationData: {
          ...decryptedData,
          nic: decryptedData.nic ? decryptedData.nic.substring(0, 6) + '****' : '',
          phoneNumber: decryptedData.phoneNumber ? decryptedData.phoneNumber.substring(0, 3) + '****' + decryptedData.phoneNumber.slice(-3) : ''
        }
      };
    });
    
    res.status(200).json({
      applications: sanitizedApplications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching job applications", details: error.message });
  }
};

// Get full application details (for authorized users only)
export const getFullApplicationDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userRole } = req.body; // Assuming user info is passed in request
    
    const application = await Application.findById(id).populate('jobId');
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    // Only allow access to own applications or if user is admin/employer
    if (application.userId !== userId && userRole !== 'admin' && userRole !== 'employer') {
      return res.status(403).json({ error: "Unauthorized access" });
    }
    
    // Decrypt sensitive data for authorized access
    const decryptedApplication = {
      ...application.toObject(),
      applicationData: decryptSensitiveData(application.applicationData)
    };
    
    res.status(200).json(decryptedApplication);
  } catch (error) {
    res.status(500).json({ error: "Error fetching application details", details: error.message });
  }
};

// Update application status (for employers/admins)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
    
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    
    const updateData = { 
      status,
      lastUpdated: new Date()
    };
    
    if (reviewNotes) {
      updateData.reviewNotes = reviewNotes;
    }
    
    const application = await Application.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    res.status(200).json({ 
      message: "Application status updated successfully", 
      application: {
        ...application.toObject(),
        applicationData: decryptSensitiveData(application.applicationData)
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating application status", details: error.message });
  }
};

// Delete an application (only by applicant or admin)
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, userRole } = req.body;
    
    const application = await Application.findById(id);
    
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    
    // Only allow deletion by applicant or admin
    if (application.userId !== userId && userRole !== 'admin') {
      return res.status(403).json({ error: "Unauthorized to delete this application" });
    }
    
    await Application.findByIdAndDelete(id);
    
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting application", details: error.message });
  }
};

// Get all applications (for admin use)
export const getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, searchTerm } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    // If search term is provided, search in non-sensitive fields
    if (searchTerm) {
      query.$or = [
        { 'applicationData.fullName': { $regex: searchTerm, $options: 'i' } },
        { 'applicationData.email': { $regex: searchTerm, $options: 'i' } },
        { 'applicationData.skills': { $in: [new RegExp(searchTerm, 'i')] } }
      ];
    }
    
    const applications = await Application.find(query)
      .populate('jobId')
      .sort({ appliedDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Application.countDocuments(query);
    
    // For admin view, show partially masked sensitive data
    const adminApplications = applications.map(app => {
      const decryptedData = decryptSensitiveData(app.applicationData);
      return {
        ...app.toObject(),
        applicationData: {
          ...decryptedData,
          nic: decryptedData.nic ? decryptedData.nic.substring(0, 6) + '****' : '',
          phoneNumber: decryptedData.phoneNumber ? decryptedData.phoneNumber.substring(0, 3) + '****' + decryptedData.phoneNumber.slice(-3) : '',
          address: decryptedData.address ? decryptedData.address.substring(0, 20) + '...' : ''
        }
      };
    });
    
    res.status(200).json({
      applications: adminApplications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching applications", details: error.message });
  }
};

// Get application statistics
export const getApplicationStats = async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const query = jobId ? { jobId } : {};
    
    const stats = await Application.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const totalApplications = await Application.countDocuments(query);
    
    const formattedStats = {
      total: totalApplications,
      byStatus: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {})
    };
    
    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: "Error fetching application statistics", details: error.message });
  }
};

// Bulk update application status
export const bulkUpdateApplicationStatus = async (req, res) => {
  try {
    const { applicationIds, status, reviewNotes } = req.body;
    
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    
    if (!applicationIds || !Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({ error: "Invalid application IDs" });
    }
    
    const updateData = { 
      status,
      lastUpdated: new Date()
    };
    
    if (reviewNotes) {
      updateData.reviewNotes = reviewNotes;
    }
    
    const result = await Application.updateMany(
      { _id: { $in: applicationIds } },
      updateData
    );
    
    res.status(200).json({ 
      message: "Applications updated successfully", 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating applications", details: error.message });
  }
};