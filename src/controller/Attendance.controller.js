import { Attendance } from "../model/Attendance.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const AttendanceController = {
  attendanceCreate : asyncHandler(async (req, res) => {
  const {
    date,
    employee: employeeName,
    checkIn: checkInTime,
    checkOut: checkOutTime,
    workingHours,
    status
  } = req.body;

  // Validate all required fields
  if (
    [date, employeeName, checkInTime, checkOutTime, workingHours, status].some(
      (field) => !field || field.toString().trim() === ""
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Create attendance document
  const createattendance = await Attendance.create({
    date,
    employee: employeeName,
    checkIn: checkInTime,
    checkOut: checkOutTime,
    workingHours,
    status,
  });

  return res.status(201).json({
    success: true,
    message: "Attendance created successfully",
    attendance: createattendance,
  });
}),
getAttendance: asyncHandler(async (req ,res) => {
  const attendance = await Attendance.find().populate("employee", "fullname");

  if(!attendance || attendance.length === 0){
    return res.status(404).json({
      success: false,
      message: "Not Found"
    })
  }

  return res.status(201).json({
    success: true,
    message: "Attendance Find Successfully",
    attendance
  })
}),
deleteAttendance: asyncHandler(async (req, res) => {
     const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Attendance ID is required",
    });
  }

  const deleted = await Attendance.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Attendance record not found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Attendance record deleted successfully",
    data: deleted,
  });
}),
 updateAttendance : asyncHandler(async (req, res) => {
  const { id } = req.params;

  const {
    date,
    employeeName,    // Ensure this matches the schema field
    checkIn,
    checkOut,
    workingHours,
    status,
  } = req.body;

  // Validate required fields
  if (
    [date, employeeName, checkIn, checkOut, workingHours, status].some(
      (field) => !field || field.toString().trim() === ""
    )
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Check if the attendance record exists
  const attendanceExists = await Attendance.findById(id);

  if (!attendanceExists) {
    return res.status(404).json({
      success: false,
      message: "Attendance record not found",
    });
  }

  // Update the record
  const updatedAttendance = await Attendance.findByIdAndUpdate(
    id,
    {
      date,
      employeeName,
      checkIn,
      checkOut,
      workingHours,
      status,
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    message: "Employee attendance updated successfully",
    data: updatedAttendance,
  });
}),

 getAttendanceById: asyncHandler(async (req, res) => {
    const { id } = req.params;
   
    const getAttendance = await Attendance.findById(id).populate("employee", "fullname");
     
    if (!getAttendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Attendance record fetched successfully",
      getAttendance,
    });
  }),
  getAttendanceByDate : asyncHandler(async (req ,res) => {
    const { date } = req.query;
    const attendance = await Attendance.find({ date }).populate("employee")

    if(!attendance){
      return res.status(400).json({
        success: false,
        message: "not found"
      })
    }

    return res.status(201).json({
      success: true,
      message: "Get Attendance by date successfully",
      attendance
    })
  })
}

export default AttendanceController
 