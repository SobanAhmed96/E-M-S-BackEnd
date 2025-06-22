import express from "express";
import { upload } from "../middleware/upload.js";
import employeeController from "../controller/Employee.controller.js";
import SalaryController from "../controller/Salary.controller.js";
import AttendanceController from "../controller/Attendance.controller.js";
import leaveController from "../controller/Leave.controller.js";
const router = express.Router();

router.route("/addEmployee").post(upload.single("profilePhoto"), employeeController.EmployeeCreate)
router.route("/login").post(employeeController.loginAdminAndEmployee)
router.route("/getEmployee").get(employeeController.getEmployee)
router.route("/isLoggedIn").get(employeeController.isLoggedIn)
router.route("/logOut").get(employeeController.logOut)
router.route("/getEmployee/:id").get(employeeController.getByIDEmployeeGet)
router.route("/updateEmployee/:id").put(upload.single('profilePhoto') , employeeController.updateEmployee)
router.route("/deleteEmployee/:id").delete( employeeController.deleteEmployee)

// Salary 
router.route("/addSalary").post(SalaryController.createSalary)
router.route("/getSalaries").get(SalaryController.getsalaries)
router.route("/updateSalary/:id").post(SalaryController.updateSalary)
router.route("/getSalary/:id").get(SalaryController.getsalariesByID)
router.route("/deleteSalary/:id").delete(SalaryController.deleteSalary)

// Attendance

router.route("/addAttendance").post(AttendanceController.attendanceCreate)
router.route("/getAttendance").get(AttendanceController.getAttendance)
router.route("/deleteAttendance/:id").delete(AttendanceController.deleteAttendance)
router.route("/updateAttendance/:id").put(AttendanceController.updateAttendance)
router.route("/getByIdAttendance/:id").get(AttendanceController.getAttendanceById)
router.route("/getAttendanceByDate").get(AttendanceController.getAttendanceByDate)

// Leave 

router.route("/addLeave").post(leaveController.addLeave)
router.route("/getLeave").get(leaveController.getLeave)
router.route("/deleteLeave/:id").delete(leaveController.deleteLeave)
router.route("/getLeaveById/:id").get(leaveController.getLeaveById)
router.route("/updateLeave/:id").put(leaveController.updateLeave)

export default router;