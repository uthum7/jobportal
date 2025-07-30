// Sample booking data for testing
// You can use this data to test your booking API endpoints

// Sample booking creation payload
export const sampleBookingData = {
  counselor_id: "675a1b2c3d4e5f6789012345", // Replace with actual counselor ID
  user_id: "675a1b2c3d4e5f6789012346",      // Replace with actual user ID
  date: "05 January 2025",
  time: "9:00 AM - 10:00 AM",
  topic: "Career Transition",
  location: "Online (Microsoft Teams)",
  type: "Video Call",
  notes: "First consultation about career change from IT to Marketing",
  duration: 60,
  price: 50
};

// Sample booking update payload
export const sampleUpdateData = {
  status: "Completed",
  notes: "Session completed successfully. Provided career roadmap and next steps."
};

// Sample cancellation payload
export const sampleCancellationData = {
  cancelled_by: "user",
  cancellation_reason: "Emergency came up, need to reschedule"
};

// Sample reschedule payload
export const sampleRescheduleData = {
  date: "07 January 2025",
  time: "2:00 PM - 3:00 PM",
  reason: "Conflict with work meeting"
};

// API endpoint examples:

/*
1. Create a new booking:
   POST http://localhost:5001/api/bookings
   Body: sampleBookingData

2. Get all bookings:
   GET http://localhost:5001/api/bookings

3. Get booking by ID:
   GET http://localhost:5001/api/bookings/BOOKING_ID

4. Update booking:
   PUT http://localhost:5001/api/bookings/BOOKING_ID
   Body: sampleUpdateData

5. Cancel booking:
   PATCH http://localhost:5001/api/bookings/BOOKING_ID/cancel
   Body: sampleCancellationData

6. Reschedule booking:
   PATCH http://localhost:5001/api/bookings/BOOKING_ID/reschedule
   Body: sampleRescheduleData

7. Get bookings by counselor:
   GET http://localhost:5001/api/bookings/counselor/COUNSELOR_ID

8. Get bookings by user:
   GET http://localhost:5001/api/bookings/user/USER_ID

9. Get booking statistics:
   GET http://localhost:5001/api/bookings/stats

10. Soft delete booking:
    DELETE http://localhost:5001/api/bookings/BOOKING_ID

11. Hard delete booking:
    DELETE http://localhost:5001/api/bookings/BOOKING_ID/hard

Query Parameters Examples:
- Filter by status: ?status=Scheduled
- Pagination: ?page=1&limit=10
- Filter by date: ?date=05 January 2025
- Filter by type: ?type=Video Call
- Sort: ?sort=createdAt (or -createdAt for descending)
*/
