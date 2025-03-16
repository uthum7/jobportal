const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

// Registeruser Schema
const RegisteruserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
    },
}, { timestamps: true });

// Hash password before saving
//RegisteruserSchema.pre("save", async function (next) {
   // if (!this.isModified("password")) return next();

   // try {
      //  const salt = await bcrypt.genSalt(10);
      //  this.password = await bcrypt.hash(this.password, salt); // Save hashed password correctly
      //  next();
 //   } catch (err) {
      //  next(err);
  //  }
//});

// Method to compare passwords
//RegisteruserSchema.methods.matchPassword = async function (enteredPassword) {
//    try {
//        console.log("Entered password:", enteredPassword);
//        console.log("Stored password:", this.password); // Use correct property name
//
//        // Compare the entered password with the hashed password in the DB
//        const isMatch = await bcrypt.compare(enteredPassword, this.password);
//        console.log("Password match result:", isMatch);
//
//        return isMatch;
//    } catch (err) {
//        console.error("Error comparing passwords:", err.message);
//        throw new Error("Error comparing passwords");
//    }
//};

// Model
const Registeruser = mongoose.model('Registeruser', RegisteruserSchema);

module.exports = Registeruser; // Export correctly
