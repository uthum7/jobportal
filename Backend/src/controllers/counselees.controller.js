import Booking from "../models/booking.model.js";
import Registeruser from "../models/Registeruser.js";
import Counselor from "../models/counselors.model.js";
import mongoose from "mongoose";

// Get all counselees for a counselor
export const getCounselees = async (req, res) => {
  try {
    const { counselorId } = req.params;
    const { search, status, sort } = req.query;

    // Verify counselor exists
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // Build aggregation pipeline
    const pipeline = [
      {
        $match: {
          counselor_id: new mongoose.Types.ObjectId(counselorId)
        }
      },
      {
        $lookup: {
          from: "registerusers",
          localField: "user_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $group: {
          _id: "$user_id",
          user: { $first: "$user" },
          sessionCount: { $sum: 1 },
          lastSession: { $max: "$date" },
          topics: { $addToSet: "$topic" },
          statuses: { $addToSet: "$status" },
          bookings: { $push: "$$ROOT" }
        }
      },
      {
        $addFields: {
          nextSession: {
            $let: {
              vars: {
                upcomingSessions: {
                  $filter: {
                    input: "$bookings",
                    cond: {
                      $and: [
                        { $in: ["$$this.status", ["Approved", "Scheduled"]] },
                        { $gte: [{ $dateFromString: { dateString: "$$this.date" } }, new Date()] }
                      ]
                    }
                  }
                }
              },
              in: {
                $min: {
                  $map: {
                    input: "$$upcomingSessions",
                    as: "session",
                    in: "$$session.date"
                  }
                }
              }
            }
          },
          isActive: {
            $gt: [
              {
                $size: {
                  $filter: {
                    input: "$bookings",
                    cond: {
                      $and: [
                        { $in: ["$$this.status", ["Approved", "Scheduled", "Pending"]] },
                        { $gte: [{ $dateFromString: { dateString: "$$this.date" } }, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] }
                      ]
                    }
                  }
                }
              },
              0
            ]
          },
          progress: {
            $let: {
              vars: {
                completedSessions: {
                  $size: {
                    $filter: {
                      input: "$bookings",
                      cond: { $eq: ["$$this.status", "Completed"] }
                    }
                  }
                }
              },
              in: {
                $switch: {
                  branches: [
                    { case: { $gte: ["$$completedSessions", 8] }, then: "Completed" },
                    { case: { $gte: ["$$completedSessions", 5] }, then: "Excellent" },
                    { case: { $gte: ["$$completedSessions", 3] }, then: "On Track" },
                    { case: { $eq: ["$$completedSessions", 0] }, then: "Needs Attention" }
                  ],
                  default: "On Track"
                }
              }
            }
          }
        }
      }
    ];

    // Add search filter if provided
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "user.username": { $regex: search, $options: "i" } },
            { "user.email": { $regex: search, $options: "i" } },
            { "topics": { $in: [new RegExp(search, "i")] } }
          ]
        }
      });
    }

    // Add status filter if provided
    if (status && status !== "all") {
      if (status === "active") {
        pipeline.push({ $match: { isActive: true } });
      } else if (status === "inactive") {
        pipeline.push({ $match: { isActive: false } });
      }
    }

    // Add sorting
    let sortStage = {};
    if (sort === "lastSession") {
      sortStage = { lastSession: -1 };
    } else if (sort === "sessionCount") {
      sortStage = { sessionCount: -1 };
    } else {
      sortStage = { "user.username": 1 };
    }
    pipeline.push({ $sort: sortStage });

    // Project final result
    pipeline.push({
      $project: {
        id: "$_id",
        name: "$user.username",
        email: "$user.email",
        avatar: { $ifNull: ["$user.profilePic", "/placeholder.svg"] },
        age: { $ifNull: ["$user.age", 25] }, // Default age if not provided
        topic: { $arrayElemAt: ["$topics", 0] }, // Primary topic
        lastSession: 1,
        nextSession: { $ifNull: ["$nextSession", "Not Scheduled"] },
        sessionCount: 1,
        status: { $cond: { if: "$isActive", then: "Active", else: "Inactive" } },
        progress: 1
      }
    });

    const counselees = await Booking.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: counselees
    });
  } catch (error) {
    console.log("Error in getCounselees controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get specific counselee details
export const getCounseleeById = async (req, res) => {
  try {
    const { counselorId, counseleeId } = req.params;

    // Verify counselor exists
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // Get counselee details
    const counselee = await Registeruser.findById(counseleeId);
    if (!counselee) {
      return res.status(404).json({
        success: false,
        message: "Counselee not found"
      });
    }

    // Get booking history
    const bookings = await Booking.find({
      counselor_id: counselorId,
      user_id: counseleeId
    }).sort({ date: -1 });

    // Calculate statistics
    const sessionCount = bookings.length;
    const completedSessions = bookings.filter(b => b.status === "Completed").length;
    const lastSession = bookings.length > 0 ? bookings[0].date : null;
    
    const upcomingSessions = bookings.filter(b => 
      ["Approved", "Scheduled"].includes(b.status) &&
      new Date(b.date) >= new Date()
    );
    const nextSession = upcomingSessions.length > 0 ? upcomingSessions[0].date : null;

    const counseleeData = {
      id: counselee._id,
      name: counselee.username,
      email: counselee.email,
      avatar: counselee.profilePic || "/placeholder.svg",
      age: counselee.age || 25,
      sessionCount,
      completedSessions,
      lastSession,
      nextSession,
      status: upcomingSessions.length > 0 || (lastSession && new Date(lastSession) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ? "Active" : "Inactive",
      bookings
    };

    res.status(200).json({
      success: true,
      data: counseleeData
    });
  } catch (error) {
    console.log("Error in getCounseleeById controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Add new counselee (create a relationship)
export const addCounselee = async (req, res) => {
  try {
    const { counselorId } = req.params;
    const { userId, topic, date, time, location, type, notes } = req.body;

    // Validation
    if (!userId || !topic || !date || !time || !location) {
      return res.status(400).json({
        success: false,
        message: "User ID, topic, date, time, and location are required"
      });
    }

    // Verify counselor exists
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // Verify user exists
    const user = await Registeruser.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Create initial booking to establish counselee relationship
    const newBooking = new Booking({
      counselor_id: counselorId,
      user_id: userId,
      date,
      time,
      topic,
      location,
      type: type || "Video Call",
      notes: notes || "",
      status: "Scheduled"
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Counselee added successfully",
      data: newBooking
    });
  } catch (error) {
    console.log("Error in addCounselee controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update counselee information
export const updateCounselee = async (req, res) => {
  try {
    const { counselorId, counseleeId } = req.params;
    const updates = req.body;

    // Verify counselor exists
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // Update user information (limited fields for privacy)
    const allowedUpdates = ['username', 'profilePic', 'age'];
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const updatedUser = await Registeruser.findByIdAndUpdate(
      counseleeId,
      filteredUpdates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Counselee not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Counselee updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.log("Error in updateCounselee controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete counselee relationship
export const deleteCounselee = async (req, res) => {
  try {
    const { counselorId, counseleeId } = req.params;

    // Verify counselor exists
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // Cancel all future bookings
    await Booking.updateMany(
      {
        counselor_id: counselorId,
        user_id: counseleeId,
        status: { $in: ["Pending", "Approved", "Scheduled"] },
        date: { $gte: new Date().toISOString().split('T')[0] }
      },
      { status: "Cancelled" }
    );

    res.status(200).json({
      success: true,
      message: "Counselee relationship ended successfully"
    });
  } catch (error) {
    console.log("Error in deleteCounselee controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get session history for a counselee
export const getCounseleeSessionHistory = async (req, res) => {
  try {
    const { counselorId, counseleeId } = req.params;

    // Verify counselor exists
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    const sessions = await Booking.find({
      counselor_id: counselorId,
      user_id: counseleeId
    }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.log("Error in getCounseleeSessionHistory controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Schedule new session
export const scheduleSession = async (req, res) => {
  try {
    const { counselorId, counseleeId } = req.params;
    const { date, time, topic, location, type, notes } = req.body;

    // Validation
    if (!date || !time || !topic || !location) {
      return res.status(400).json({
        success: false,
        message: "Date, time, topic, and location are required"
      });
    }

    // Verify counselor exists
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // Verify user exists
    const user = await Registeruser.findById(counseleeId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Counselee not found"
      });
    }

    const newSession = new Booking({
      counselor_id: counselorId,
      user_id: counseleeId,
      date,
      time,
      topic,
      location,
      type: type || "Video Call",
      notes: notes || "",
      status: "Scheduled"
    });

    await newSession.save();

    res.status(201).json({
      success: true,
      message: "Session scheduled successfully",
      data: newSession
    });
  } catch (error) {
    console.log("Error in scheduleSession controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update session progress
export const updateSessionProgress = async (req, res) => {
  try {
    const { counselorId, counseleeId } = req.params;
    const { progress, notes } = req.body;

    // Verify counselor exists
    const counselor = await Counselor.findById(counselorId);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // For now, we'll store progress information in the latest booking's notes
    // In a real application, you might want a separate Progress model
    const latestBooking = await Booking.findOne({
      counselor_id: counselorId,
      user_id: counseleeId
    }).sort({ date: -1 });

    if (!latestBooking) {
      return res.status(404).json({
        success: false,
        message: "No sessions found for this counselee"
      });
    }

    const progressNote = `Progress Update: ${progress}. ${notes || ''}`;
    latestBooking.notes = latestBooking.notes ? 
      `${latestBooking.notes}\n\n${progressNote}` : 
      progressNote;

    await latestBooking.save();

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: { progress, notes }
    });
  } catch (error) {
    console.log("Error in updateSessionProgress controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
