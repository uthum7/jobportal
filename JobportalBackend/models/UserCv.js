const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const UserCvSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true , index: true },
    personalInfo: {
        fullname:{
            type: String,
            required: true
        },
        nameWithInitials:{
            type: String,       
        }, 
        jobTitle:{
            type: String,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        phone:{
            type: String,
            required: true
        },
        profileParagraph:{
            type: String,
        }
    },

    educationDetails: [{
        schoolName:{
            type: String 
        },
        starDate:{
            type: Date , 
            required: true
        },
        enddate:{
            type: Date,
            required: true
        },
        moreDetails:{
            type: String
        },
        universitiyName:{
            type: String
        },
        uniStartDate:{
            type: Date,
            required: true
        },
        uniEndDate:{
            type: Date,
            required: true
        },
        uniMoreDetails:{
            type: String
        }
    }],
    skill:[{
        skillName:{
            type: String
        },
        skillLevel:{
            type: String
        }
    }],
    summary:[{
        summary:{
            type: String
        }
    }],
    professionalExperience:[{
        jobTitle:{
            type: String
        },
        companyName:{
            type: String
        },
        jstartDate:{
            type: Date,
            required: true
        },
        jendDate:{
            type: Date,
            required: true
        },
        jobDescription:{
            type: String
        }
    }],
    references:[{
        referenceName:{
            type: String
        }
    }]
});

const UserCv = mongoose.model('UserCv', UserCvSchema);
module.exports = UserCv;
