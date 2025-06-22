import mongoose from 'mongoose';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const employeeSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "Fullname are required"],
      trim: true,
      unique: [true, "Invalid"],
      minlength: [3, 'Full name must be at least 3 characters long'],
      maxlength: [50, 'Full name must be at most 50 characters long'],
    },
    email:{
        type: String,
        required: true,
        unique: [true , "Email already exists"],
        trim: true,
        lowercase: true,
    },
      phone: {
      type: String,
      required: [true, "Phone are required"],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "dob are required"],
    },
    gender: {
        type: String,
        required: [true, "Gender are required"],
        enum: ["Male", "Female", "Other"]    
    },   
    department: {
      type: String,
      required: [true, "Department are required"],
      enum: ["HR", "IT", "Finance", "Marketing", "Sales"],
    },
    designation: {
      type: String,
      required: [true, "Designation are required"],
    },
    joiningDate: {
      type: Date,
      required: [true, "Joining Date are required"],
    },
    employmentType: {
      type: String,
      required: [true, "Employment Type are required"],
      enum: ["Full-time", "Part-time", "Contract"],
    },
    status: {
      type: String,
      required: [true, "Status are required"],
      enum: ["Active", "Inactive"],
      default: "Active", // optional: makes new employees active by default
    },
    profilePhoto: {
      type: String,
      required: [true, "Profile Photo are required"],
    },
    password: {
      type: String,
      required: [true, "Password are required"],
      minlength: [6, "Password must be at least 6 characters long"],
    }
  },
  { timestamps: true }
);

employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10)
    }
    next()
})

employeeSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

employeeSchema.methods.generateToken = function(){
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            fullname: this.fullname
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    )
}


export const Employee = mongoose.model("Employee", employeeSchema);