import User from "../modules/user.model.js"
import{generateToken} from "../lib/utils.js";
import bcrypt from "bcryptjs"
import cloudinary from "../LIB/cloudinary.js";


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

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

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
                profilepic:newUser.profilepic,

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

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
           email:user.email,
            profilepic:user.profilepic,
        })
    } catch(error){
        console.log("error in signup controller",error.message);
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

export const updateProfile = async(req, res) =>{
    try{
        const {profilepic}=req.body;
        const userId=req.user._id;

        if (!profilePic){
            return res.status(400).json({message:"Profile pic is required"});

        }

        const uploadResponse = await cloudinary.upload(profilePic)
        const updateUser = await User.findByIdAndUpdate(userId,{profilepic:uploadResponse.secure_url},{new:true})

        res.status(200).json(updateUser)

    }catch(error){
        console.log("error in update profile:",error);
        res.status(500).json({message:"Internal server Error"});


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