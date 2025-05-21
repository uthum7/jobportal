import User from "../models/user.model.js"
import{generateToken} from "../lib/utils.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

// User signup controller - handles new user registration
export const signup = async (req,res)=>{
    const{fullName,email,password} = req.body 
    try{

        // Validation for required fields
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});

            
        }
         // Password length validation
        if(password.length < 6){
            return res.status(400).json({message:"password must be at least 6 characters"});
        }

         // Check if user already exists with the same email
        const user = await User.findOne({email})

        if(user) return res.status(400).json({message:"Email already exists"});

        // Hash the password for security
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({  // Create new user object
            fullName:fullName,
            email:email,
            password:hashedPassword
        })

        if(newUser){
            // Generate JWT token for authentication
            generateToken(newUser._id, res);
            await newUser.save(); // Save the user to the database

            res.status(201).json({ // Return user data without password
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

// User login controller - authenticates existing users
export const login = async (req,res)=>{
    const{email, password}=req.body;
    try{
        const user = await User.findOne({email});// Find user by email

        if (!user){
            return res.status(400).json({message:"Invalid credentials"});// Return error if user doesn't exist
        }


        // Compare password with hashed password in DB
        const isPasswordCorrect = await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"Invalid credentials"});
  
        }

        generateToken(user._id,res)// Generate JWT token for authentication

        res.status(200).json({ // Return user data without password
            _id:user._id,
            fullName:user.fullName,
           email:user.email,
            profilePic:user.profilepic,
        })
    } catch(error){
        console.log("error in login controller",error.message);
        res.status(500).json({message:"Internal server Error"});

    }
};

export const logout = (req,res)=>{

try{
    res.cookie("jwt","",{maxAge:0})//Setting a cookie named "jwt" (which previously contained your authentication token),Setting maxAge:0, which makes the cookie expire immediately
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
  
      if (!profilePic) { // Validate profile picture exists
        return res.status(400).json({ message: "Profile pic is required" });
      }
  
      const uploadResponse = await cloudinary.uploader.upload(profilePic); // Upload the image to Cloudinary
      const updatedUser = await User.findByIdAndUpdate(// Update user's profile picture in the database
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
  
export const checkAuth = (req, res)=> {
    try{// Return user data from the request object (populated by middleware)
        res.status(200).json(req.user);

    }catch(error){
        console.log("Error in checkAuth controller",error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};