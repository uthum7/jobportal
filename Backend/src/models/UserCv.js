import mongoose from "mongoose";

const { Schema } = mongoose;

const UserCvSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
    },
    personalInfo: {
        fullname: {
            type: String,

        },
        nameWithInitials: {
            type: String,
        },
        jobTitle: {
            type: String,

        },
        address: {
            type: String,

        },
        email: {
            type: String,

        },
        phone: {
            type: String,

        },
        profileParagraph: {
            type: String,
        },
    },
    educationDetails: {
        
            schoolName: {
                type: String,
            },
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            },
            moreDetails: {
                type: String,
            },
            universitiyName: {
                type: String,
            },
            uniStartDate: {
                type: Date,
            },
            uniEndDate: {
                type: Date,
            },
            uniMoreDetails: {
                type: String,
            },
        
    },
    skill: [
        {
            skillName: {
                type: String,
            },
            skillLevel: {
                type: String,
            },
        },
    ],
    summary: {
        type: String,
    },
    professionalExperience: [
        {

            companyName: {
                type: String,
            },
            jendDate: {
                type: Date,
            },
            jobDescription: {
                type: String,
            },
            jobTitle: { 
                type: String,
            },
            jstartDate: {
                type: Date,
            },
            
        },
    ],
    references: [
        {
            referenceName: {
                type: String,
            },
            position: {
                type: String,
            },
            company: {
                type: String,
            },
            contact: {
                type: String,
            },
            _id: false, // Disable the automatic `_id` field for subdocuments
        },
    ],
});

const UserCv = mongoose.model("UserCv", UserCvSchema);

export default UserCv;
