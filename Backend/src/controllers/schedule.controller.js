import Schedule from "../models/schedule.model.js";
import Booking from "../models/booking.model.js";

// Create or update a schedule for a specific day
export const createSchedule = async (req, res) => {
  try {
    const { dayOfWeek, isAvailable, timeSlots } = req.body;
    const counselorId = req.user._id;

    // Validate input
    if (!dayOfWeek || !Array.isArray(timeSlots)) {
      return res.status(400).json({ message: "Day of week and time slots are required" });
    }

    // Check if schedule already exists for this day
    const existingSchedule = await Schedule.findOne({ 
      counselor: counselorId,
      dayOfWeek
    });

    if (existingSchedule) {
      // Update existing schedule
      existingSchedule.isAvailable = isAvailable;
      existingSchedule.timeSlots = timeSlots;
      await existingSchedule.save();
      
      return res.status(200).json(existingSchedule);
    }

    // Create new schedule
    const newSchedule = new Schedule({
      counselor: counselorId,
      dayOfWeek,
      isAvailable,
      timeSlots
    });

    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    console.log("Error in createSchedule controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get schedule for a specific day
export const getScheduleByDay = async (req, res) => {
  try {
    const { dayOfWeek } = req.params;
    const counselorId = req.user._id;

    const schedule = await Schedule.findOne({
      counselor: counselorId,
      dayOfWeek
    });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found for this day" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    console.log("Error in getScheduleByDay controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all schedules for a counselor
export const getCounselorSchedule = async (req, res) => {
  try {
    const { counselorId } = req.params;

    const schedule = await Schedule.find({ counselor: counselorId });

    res.status(200).json({ schedule });
  } catch (error) {
    console.log("Error in getCounselorSchedule controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { counselorId, date } = req.params;
    
    // Convert date to day of week (0 = Sunday, 1 = Monday, etc.)
    const dateObj = new Date(date);
    const dayIndex = dateObj.getDay();
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[dayIndex];
    
    // Get counselor's schedule for this day
    const schedule = await Schedule.findOne({
      counselor: counselorId,
      dayOfWeek
    });

    if (!schedule || !schedule.isAvailable) {
      return res.status(200).json({ availableSlots: [] });
    }

    // Get all available time slots from the schedule
    let availableSlots = schedule.timeSlots.filter(slot => slot.isAvailable);

    // Get all bookings for this counselor on this date
    const bookings = await Booking.find({
      counselor: counselorId,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      },
      status: { $nin: ["Cancelled"] }
    });

    // Remove time slots that are already booked
    if (bookings.length > 0) {
      availableSlots = availableSlots.filter(slot => {
        return !bookings.some(booking => 
          booking.startTime === slot.startTime && booking.endTime === slot.endTime
        );
      });
    }

    res.status(200).json({ availableSlots });
  } catch (error) {
    console.log("Error in getAvailableTimeSlots controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a schedule
export const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const counselorId = req.user._id;

    const schedule = await Schedule.findOneAndDelete({
      _id: scheduleId,
      counselor: counselorId
    });

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    res.status(200).json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSchedule controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};