import mongoose from "mongoose";

const CounselorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  rating: { type: Number, required: true },
  reviews: { type: Number, required: true },
  availability: [{ type: String, enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }],
  image: { type: String }
});

const Counselor = mongoose.model("Counselor", CounselorSchema);

export default Counselor;
