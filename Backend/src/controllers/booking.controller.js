import Booking from "../models/booking.model.js";
import Counselor from "../models/counselors.model.js";

// Get all bookings with filtering, pagination, and search
export const getAllBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      counselor_id,
      user_id,
      date,
      type,
      sort = "-createdAt"
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (counselor_id) filter.counselor_id = counselor_id;
    if (user_id) filter.user_id = user_id;
    if (date) filter.date = date;
    if (type) filter.type = type;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get bookings with population
    const bookings = await Booking.find(filter)
      .populate('counselor_id', 'name specialty rating image')
      .populate('user_id', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.log("Error in getAllBookings controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('counselor_id', 'name specialty rating image availability')
      .populate('user_id', 'username email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.log("Error in getBookingById controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Create new booking
export const createBooking = async (req, res) => {
  try {
    const {
      counselor_id,
      user_id,
      date,
      time,
      topic,
      location,
      type,
      notes,
      duration,
      price
    } = req.body;

    // Validate required fields
    if (!counselor_id || !user_id || !date || !time || !topic || !location || !type) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields: counselor_id, user_id, date, time, topic, location, type"
      });
    }

    // Check if counselor exists
    const counselor = await Counselor.findById(counselor_id);
    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found"
      });
    }

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      counselor_id,
      date,
      time,
      status: { $in: ["Scheduled", "Rescheduled"] }
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked"
      });
    }

    // Create booking
    const booking = new Booking({
      counselor_id,
      user_id,
      date,
      time,
      topic,
      location,
      type,
      notes,
      duration: duration || 60,
      price: price || 0
    });

    await booking.save();

    // Populate the booking data for response
    const populatedBooking = await Booking.findById(booking._id)
      .populate('counselor_id', 'name specialty rating image')
      .populate('user_id', 'username email');

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: populatedBooking
    });
  } catch (error) {
    console.log("Error in createBooking controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // If updating time/date, check for conflicts
    if (updateData.date || updateData.time) {
      const conflictingBooking = await Booking.findOne({
        _id: { $ne: id },
        counselor_id: booking.counselor_id,
        date: updateData.date || booking.date,
        time: updateData.time || booking.time,
        status: { $in: ["Scheduled", "Rescheduled"] }
      });

      if (conflictingBooking) {
        return res.status(409).json({
          success: false,
          message: "This time slot is already booked"
        });
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('counselor_id', 'name specialty rating image')
      .populate('user_id', 'username email');

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking
    });
  } catch (error) {
    console.log("Error in updateBooking controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancelled_by, cancellation_reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled"
      });
    }

    booking.status = "Cancelled";
    booking.cancelled_by = cancelled_by;
    booking.cancellation_reason = cancellation_reason;

    await booking.save();

    const populatedBooking = await Booking.findById(id)
      .populate('counselor_id', 'name specialty rating image')
      .populate('user_id', 'username email');

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: populatedBooking
    });
  } catch (error) {
    console.log("Error in cancelBooking controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Reschedule booking
export const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, reason } = req.body;

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: "Please provide new date and time"
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.status !== "Scheduled") {
      return res.status(400).json({
        success: false,
        message: "Only scheduled bookings can be rescheduled"
      });
    }

    // Check for conflicts
    const conflictingBooking = await Booking.findOne({
      _id: { $ne: id },
      counselor_id: booking.counselor_id,
      date,
      time,
      status: { $in: ["Scheduled", "Rescheduled"] }
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked"
      });
    }

    // Create a new booking for the rescheduled appointment
    const rescheduledBooking = new Booking({
      ...booking.toObject(),
      _id: undefined,
      date,
      time,
      status: "Rescheduled",
      rescheduled_from: booking._id,
      notes: booking.notes + (reason ? `\n\nReschedule reason: ${reason}` : ''),
      createdAt: undefined,
      updatedAt: undefined
    });

    await rescheduledBooking.save();

    // Update original booking status
    booking.status = "Rescheduled";
    await booking.save();

    const populatedBooking = await Booking.findById(rescheduledBooking._id)
      .populate('counselor_id', 'name specialty rating image')
      .populate('user_id', 'username email');

    res.status(200).json({
      success: true,
      message: "Booking rescheduled successfully",
      data: populatedBooking
    });
  } catch (error) {
    console.log("Error in rescheduleBooking controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Soft delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    await booking.softDelete();

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully"
    });
  } catch (error) {
    console.log("Error in deleteBooking controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Hard delete booking (permanent)
export const hardDeleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking permanently deleted"
    });
  } catch (error) {
    console.log("Error in hardDeleteBooking controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get bookings by counselor
export const getBookingsByCounselor = async (req, res) => {
  try {
    const { counselor_id } = req.params;
    const { status, date, page = 1, limit = 10 } = req.query;

    const filter = { counselor_id };
    if (status) filter.status = status;
    if (date) filter.date = date;

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('user_id', 'username email')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.log("Error in getBookingsByCounselor controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get bookings by user
export const getBookingsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { user_id };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const bookings = await Booking.find(filter)
      .populate('counselor_id', 'name specialty rating image')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.log("Error in getBookingsByUser controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get booking statistics
export const getBookingStats = async (req, res) => {
  try {
    const { counselor_id, user_id, date_from, date_to } = req.query;

    const matchFilter = {};
    if (counselor_id) matchFilter.counselor_id = counselor_id;
    if (user_id) matchFilter.user_id = user_id;
    if (date_from && date_to) {
      matchFilter.createdAt = {
        $gte: new Date(date_from),
        $lte: new Date(date_to)
      };
    }

    const stats = await Booking.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          total_bookings: { $sum: 1 },
          scheduled: { $sum: { $cond: [{ $eq: ["$status", "Scheduled"] }, 1, 0] } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] } },
          rescheduled: { $sum: { $cond: [{ $eq: ["$status", "Rescheduled"] }, 1, 0] } },
          total_revenue: { $sum: "$price" },
          avg_price: { $avg: "$price" }
        }
      }
    ]);

    const result = stats[0] || {
      total_bookings: 0,
      scheduled: 0,
      completed: 0,
      cancelled: 0,
      rescheduled: 0,
      total_revenue: 0,
      avg_price: 0
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.log("Error in getBookingStats controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Approve booking
export const approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { meeting_link, notes } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be approved"
      });
    }

    // If booking has a price, approve but require payment
    // If no price, directly schedule
    const updateData = {
      status:"Approved",
      meeting_link,
      notes: notes || booking.notes
    };

    if (booking.price <= 0) {
      updateData.payment_status = "Paid"; // No payment needed
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('counselor_id', 'name specialty rating image')
      .populate('user_id', 'username email');

    const statusMessage = booking.price > 0 
      ? "Booking approved - Payment required to confirm"
      : "Booking approved and scheduled";

    res.status(200).json({
      success: true,
      message: statusMessage,
      data: updatedBooking
    });
  } catch (error) {
    console.log("Error in approveBooking controller", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
