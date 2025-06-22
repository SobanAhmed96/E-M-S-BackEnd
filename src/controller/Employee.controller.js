import jwt from 'jsonwebtoken';
import { Employee } from '../model/Employee.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import uploadCloudinary from '../utils/cloudinary.js';
import bcrypt from 'bcrypt';

const employeeController = {
  EmployeeCreate: asyncHandler(async (req, res) => {
    const {
      fullname,
      email,
      phone,
      dob,
      gender,
      status,
      department,
      designation,
      joiningDate,
      employmentType,
      password,
    } = req.body;

    // ✅ Proper validation of actual values, not string keys
    if (
      [
        fullname,
        email,
        phone,
        dob,
        gender,
        department,
        designation,
        joiningDate,
        employmentType,
        status,
        password,
      ].some((field) => !field || field.trim() === '')
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // ✅ Check if email already exists
    const existingEmployee = await Employee.findOne( { email } );
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // ✅ Check if file is uploaded
    const profilePhoto = req.file;
    if (!profilePhoto) {
      return res.status(400).json({
        success: false,
        message: 'Profile photo is required',
      });
    }

    // ✅ Upload to Cloudinary
    const uploadResult = await uploadCloudinary(profilePhoto.path);
    if (!uploadResult?.secure_url) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image to Cloudinary',
      });
    }

    // ✅ Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create employee in database
    const createdEmployee = await Employee.create({
      fullname,
      email,
      phone,
      dob,
      gender,
      department,
      designation,
      joiningDate,
      employmentType,
      status,
      password,
      profilePhoto: uploadResult.secure_url,
    });

    // ✅ Send response
    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      employee: createdEmployee,
    });
  }),
loginAdminAndEmployee: asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const user = await Employee.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = user.generateToken();
  if (!token) {
    return res.status(500).json({
      success: false,
      message: "Token generation failed",
    });
  }

  const userData = await Employee.findById(user._id).select("-password");

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: userData,
  });
}),

getEmployee: asyncHandler(async (req, res) => {
  const employees = await Employee.find().select("-password"); // don't send password
  const token = req.cookies.token;

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

  if (!employees || employees.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No employees found",
    });
  }

  return res.status(200).json({
    success: true,
    employees,
    verifyToken

  });
}),
isLoggedIn: asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated"
    });
  }

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await Employee.findById(verifyToken.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
        verifyToken
      });
    }

    res.status(200).json({
      success: true,
      employees: user, // match your frontend variable naming
    });

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
}),
logOut: asyncHandler(async (req ,res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  })

}),
 getByIDEmployeeGet: asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const employee = await Employee.findById(id).select("-password");

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}),
updateEmployee: asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fullname,
      phone,
      dob,
      gender,
      department,
      designation,
      joiningDate,
      employmentType,
      status,
      password,
    } = req.body;

    // Basic required fields check (except password and profilePhoto)
    if ([fullname, phone, dob, gender, department, designation, joiningDate, employmentType, status].some(field => !field || field.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields except password are required",
      });
    }

    let photoUrl;

    // Handle profile photo upload if a file is provided
    if (req.file) {
      try {
        const uploadResult = await uploadCloudinary(req.file.path);
        photoUrl = uploadResult.secure_url;
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile photo",
          error: error.message,
        });
      }
    }

    // Hash password only if provided
    let hashedPassword;
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Prepare update object
    const updateData = {
      fullname,
      phone,
      dob,
      gender,
      department,
      designation,
      joiningDate,
      employmentType,
      status,
    };

    if (hashedPassword) updateData.password = hashedPassword;
    if (photoUrl) updateData.profilePhoto = photoUrl;

    const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true }).select("-password");

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      updatedEmployee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
}),

deleteEmployee : asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Employee ID is required",
    });
  }

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting employee:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
})









};

export default employeeController;
