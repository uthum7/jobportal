import Counselor from "../models/counselors.model.js";
import cloudinary from "../lib/cloudinary.js";

// Get all counselors
export const getAllCounselors = async (_unused, res) => {
  try {
    const counselors = await Counselor.find();
    res.status(200).json({
      success: true,
      data: counselors
    });
  } catch (error) {
    console.log("Error in getAllCounselors controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get single counselor by ID
export const getCounselorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const counselor = await Counselor.findById(id);
    
    if (!counselor) {
      return res.status(404).json({ 
        success: false, 
        message: "Counselor not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: counselor
    });
  } catch (error) {
    console.log("Error in getCounselorById controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create new counselor
export const createCounselor = async (req, res) => {
  try {
    const { 
      name, 
      specialty, 
      rating, 
      reviews, 
      availability, 
      email, 
      phone, 
      experience 
    } = req.body;

    // Validation
    if (!name || !specialty) {
      return res.status(400).json({
        success: false,
        message: "Name and specialty are required"
      });
    }

    // Check if email already exists
    if (email) {
      const existingCounselor = await Counselor.findOne({ email });
      if (existingCounselor) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
    }

    let imageUrl = "/placeholder.svg?height=80&width=80";

    // Handle image upload if provided
    if (req.body.image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(req.body.image, {
          folder: "counselors"
        });
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        console.log("Error uploading image:", uploadError);
      }
    }

    const newCounselor = new Counselor({
      name,
      specialty,
      rating: rating || 0,
      reviews: reviews || 0,
      availability: availability || [],
      image: imageUrl,
      email,
      phone,
      experience: experience || 0
    });

    await newCounselor.save();

    res.status(201).json({
      success: true,
      message: "Counselor created successfully",
      data: newCounselor
    });
  } catch (error) {
    console.log("Error in createCounselor controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update counselor
export const updateCounselor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if counselor exists
    const counselor = await Counselor.findById(id);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // Check if email is being updated and already exists
    if (updates.email && updates.email !== counselor.email) {
      const existingCounselor = await Counselor.findOne({ email: updates.email });
      if (existingCounselor) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
    }

    // Handle image upload if provided
    if (updates.image && updates.image !== counselor.image) {
      try {
        // Delete old image if it's not the default placeholder
        if (counselor.image && !counselor.image.includes("placeholder.svg")) {
          const publicId = counselor.image.split("/").pop().split(".")[0];
          await cloudinary.uploader.destroy(`counselors/${publicId}`);
        }

        // Upload new image
        const uploadResponse = await cloudinary.uploader.upload(updates.image, {
          folder: "counselors"
        });
        updates.image = uploadResponse.secure_url;
      } catch (uploadError) {
        console.log("Error uploading image:", uploadError);
      }
    }

    const updatedCounselor = await Counselor.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Counselor updated successfully",
      data: updatedCounselor
    });
  } catch (error) {
    console.log("Error in updateCounselor controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete counselor (soft delete)
export const deleteCounselor = async (req, res) => {
  try {
    const { id } = req.params;

    const counselor = await Counselor.findById(id);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // Soft delete by setting isActive to false
    await Counselor.findByIdAndUpdate(id, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Counselor deleted successfully"
    });
  } catch (error) {
    console.log("Error in deleteCounselor controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Hard delete counselor (permanent deletion)
export const hardDeleteCounselor = async (req, res) => {
  try {
    const { id } = req.params;

    const counselor = await Counselor.findById(id);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // Delete image from cloudinary if it's not the default placeholder
    if (counselor.image && !counselor.image.includes("placeholder.svg")) {
      try {
        const publicId = counselor.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`counselors/${publicId}`);
      } catch (deleteError) {
        console.log("Error deleting image:", deleteError);
      }
    }

    await Counselor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Counselor permanently deleted"
    });
  } catch (error) {
    console.log("Error in hardDeleteCounselor controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get counselors by specialty
export const getCounselorsBySpecialty = async (req, res) => {
  try {
    const { specialty } = req.params;
    
    const counselors = await Counselor.find({
      specialty: { $regex: specialty, $options: 'i' },
      isActive: true
    }).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      data: counselors
    });
  } catch (error) {
    console.log("Error in getCounselorsBySpecialty controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update counselor rating
export const updateCounselorRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const counselor = await Counselor.findById(id);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // Calculate new average rating
    const totalRating = counselor.rating * counselor.reviews + rating;
    const newReviews = counselor.reviews + 1;
    const newRating = totalRating / newReviews;

    const updatedCounselor = await Counselor.findByIdAndUpdate(
      id,
      {
        rating: Math.round(newRating * 10) / 10, // Round to 1 decimal place
        reviews: newReviews
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      data: updatedCounselor
    });
  } catch (error) {
    console.log("Error in updateCounselorRating controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
