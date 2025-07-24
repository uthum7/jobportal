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

const Job = mongoose.model("jobs",JobsSchema);

export default Job