import cloudinary from "../lib/cloudinary.js";
import Registeruser from "../models/Registeruser.js";
import Message from "../models/message.model.js"; // KEEP THIS if you're using chat
import { getReceiverSocketId, io } from "../lib/socket.js";

// Get all users (except current user) for sidebar
export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // First get the logged-in user's roles
    const currentUser = await Registeruser.findById(loggedInUserId).select("roles");

    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentRole = currentUser.roles?.[0]; // assuming roles is an array
     
     console.log("Current User ID:", loggedInUserId);
    console.log("Current User Role:", currentRole);

    
    let allowedRoles = [];

          // Define access logic based on role
          if (currentRole === "ADMIN") {
        allowedRoles = ["ADMIN", "EMPLOYEE", "JOBSEEKER", "MENTOR", "MENTEE"];
      } else if (currentRole === "MENTOR") {
        allowedRoles = ["ADMIN", "MENTOR", "MENTEE"];
      } else if (currentRole === "EMPLOYEE") {
        allowedRoles = ["ADMIN", "EMPLOYEE", "JOBSEEKER"];
      }else if (currentRole === "JOBSEEKER") {
        allowedRoles = ["ADMIN", "EMPLOYEE"];
      }


    // Query only users with allowed roles (excluding self)
    const filteredUsers = await Registeruser.find({
      _id: { $ne: loggedInUserId },
     roles: { $elemMatch: { $in: allowedRoles } },
    }).select("fullName profilePic isOnline email _id roles username");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUserForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get all messages between logged-in user and another user
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages Controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send a new message (with optional image)
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      isRead: false,
    });

    await newMessage.save();

    // Realtime messaging using socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage Controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user._id;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Only sender can delete the message
    if (!message.senderId.equals(userId)) {
      return res.status(403).json({ message: "You can only delete your own messages" });
    }

    await Message.findByIdAndDelete(messageId);

    return res.status(200).json({ message: "Message deleted successfully", messageId });
  } catch (error) {
    console.error("Error deleting message:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
