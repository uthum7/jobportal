import User from "../models/user.model.js"
import{generateToken} from "../lib/utils.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";
import Registeruser from "../models/Registeruser.js";


export const signup = async (req,res)=>{
    const{fullName,email,password} = req.body 
    try{

        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});

            
        }
        if(password.length < 6){
            return res.status(400).json({message:"password must be at least 6 characters"});
        }

        const user = await User.findOne({email})

        if(user) return res.status(400).json({message:"Email already exists"});

        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = new User({
            fullName:fullName,
            email:email,
            password:hashedPassword
        })

        if(newUser){
            //generate jwt token here
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilepic,
            });

        }else{

         res.status(400).json({message:"Invalid user data"});
        }
    }catch(error){
        console.log("error in signup controller",error.message);
        res.status(500).json({message:"Internal server Error"});

    }
};

export const login = async (req,res)=>{
    const{email, password}=req.body;
    try{
        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
  
        }

        generateToken(user._id,res)
        
        if("MENTOR" in user.roles) {
            console.log("User is a mentor, counselors_id:", user.counselors_id);
            res.status(200).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilepic,
                role:user.role,
                counselors_id: user.counselors_id 
            })
        }
        else {
            res.status(200).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilepic,
                role:user.role
            });
        }
        
        } catch(error){
        console.log("error in login controller",error.message);
        res.status(500).json({message:"Internal server Error"});

    }
};

export const logout = (req,res)=>{

try{
    res.cookie("jwt","",{maxAge:0})
    res.status(200).json({message:"Logged out successfully"});

}catch(error){
    console.log("Error in Logout controller",error.message);
    res.status(500).json({message:"Internal server Error"});

}

};

export const updateProfile = async (req, res) => {
    try {
      const { profilePic } = req.body;
      const userId = req.user._id;
  
      if (!profilePic) {
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResponse.secure_url },
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log("error in update profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
// Change Password Endpoint
export const changePassword = async (req, res) => {
    console.log("Change Password request received");
  try {
    console.log("Request body:", req.body);
    const { oldPassword, newPassword, userId } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new password are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    const user = await Registeruser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
        console.log("Old password does not match for user:", user.email);
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log("Error in changePassword controller", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
  
export const checkAuth = (req, res)=> {
    try{
        res.status(200).json(req.user);

    }catch(error){
        console.log("Error in checkAuth controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};