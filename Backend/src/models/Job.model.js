import mongoose, { Types } from "mongoose";

const JobsSchema = new mongoose.Schema({

    
    JobTitle:{
        type:String,
        required:true
    },
    JobExperienceYears: {
        type:Number
    },
    JobMode:{
        type:String
    },
    JobType:{
        type:String
    },
    JobDeadline:{
        type:Date
    },
    JobDescription:{
        type:String
    },
    Requirements:{
        type:Array
    },
    Qualifications:{
        type:Array
    },
    Tags:{
        type:Array
    },
    Responsibilities:{
        type:Array
    },

    PostedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Registeruser", required: true },
    postedDate:{
        type:Date,
        default:Date.now
    },
    PostedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

    
}

);
// ✅ Prevent OverwriteModelError
const Job = mongoose.models.jobs || mongoose.model("Job", JobsSchema);
  //jobs is the collection name

export default Job;