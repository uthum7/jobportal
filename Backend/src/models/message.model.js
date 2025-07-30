import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
            ref:"User",
=======
            ref:"Registeruser",
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
            required:true,
        },

        receiverId:{
            type:mongoose.Schema.Types.ObjectId,
<<<<<<< HEAD
            ref:"User",
=======
            ref:"Registeruser",
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
            required:true,

        },
        text:{
            type:String,
        },

        image:{
            type:String,
        },
<<<<<<< HEAD
=======
        isRead: {
      type: Boolean,
      default: false, // <--- ✅ New field to track read/unread state
    },
>>>>>>> c1587ed030af74a541137562c0abe076b06bda19
    },
    {timestamps:true}
);

const Message = mongoose.model("Message",messageSchema);

export default Message;